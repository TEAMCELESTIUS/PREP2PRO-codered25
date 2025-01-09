from flask import Blueprint, request, jsonify  # type: ignore
from .utils import extract_text_from_pdf,problems_DS,problems_SDE
from app.supabase_client import supabase_client
from datetime import datetime
import json
from app.redis_client import redis_client
from dotenv import load_dotenv
import io
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings # type: ignore
import pandas as pd
from langchain_core.documents import Document  # type: ignore
from langchain_community.vectorstores import FAISS # type: ignore
from google.oauth2 import service_account # type: ignore
import google.generativeai as genai  # type: ignore

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/initialize', methods=['POST'])
def initialize_interview():
    data = request.form
    domain = data.get('domain').strip()
    interview_type = data.get('type').strip()
    resume = request.files.get('resume')

    if not domain or not interview_type or not resume:
        return jsonify({"error": "Missing required fields"}), 400
    if not resume.filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file format, only PDFs are allowed"}), 400
    
    resume_text = extract_text_from_pdf(resume)

    response = supabase_client.table("domains").select("id").eq("name", domain).execute()
    if not response.data:
        return jsonify({"error": f"No domain found for {domain}"}), 404
    domain_id = response.data[0]["id"]

    response = supabase_client.table("rounds").select("id").eq("name", interview_type).execute()
    if not response.data:
        return jsonify({"error": f"No round found for {interview_type}"}), 404
    round_id = response.data[0]["id"]

    response = supabase_client.table("interview_rules").select("rule_content").eq("domain_id", domain_id).eq("round_id", round_id).execute()
    if not response.data:
        return jsonify({"error": "No rules found for the selected domain and type"}), 404
    interview_rules = response.data[0]

    session_id = f"{domain}_{interview_type}_{resume.filename.split('.')[0]}"

    if interview_type == "TECHNICAL_1":
        problems = problems_SDE()
    if domain == "DS" and interview_type == "TECHNICAL":
        problems = problems_DS()

    session_data = {
        "domain": domain,
        "type": interview_type,
        "resume": resume_text,
        "rules": interview_rules,
        "chat_history": [
            {"role": "system", "content": "Hi I am Alice. I am your interviewer today. Could you please introduce yourself?"}
        ],
        "start_time": datetime.now().isoformat() 
    }
    if 'problems' in locals() and problems:
        session_data["problems"] = problems 

    session_data_str = json.dumps(session_data)

    redis_client.hset(session_id, "session_data", session_data_str)

    return jsonify({"session_id": session_id, "interviewer_response": session_data["chat_history"]}), 200

@interview_bp.route('/next_question', methods=['POST'])
def next_question():
    data = request.form
    session_id = data.get('session_id')
    user_answer = data.get('user_answer')

    if not session_id or not user_answer:
        return jsonify({"error": "Missing session ID or user answer"}), 400

    redis_key_type = redis_client.type(session_id)
    if redis_key_type != 'hash':
        return jsonify({"error": "Invalid Redis key type. Expected hash."}), 400

    session_data_str = redis_client.hget(session_id, 'session_data')

    if session_data_str is None:
        return jsonify({"error": "Invalid session ID or missing session data"}), 404
    if isinstance(session_data_str, bytes):
        session_data_str = session_data_str.decode('utf-8')

    try:
        session_data = json.loads(session_data_str)
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding session data"}), 500

    session_data["chat_history"].append({"role": "user", "content": user_answer})
    start_time = session_data.get('start_time')
    elapsed_time = (datetime.now() - datetime.fromisoformat(start_time)).total_seconds() / 60
    # if elapsed_time > 50:
    #     conclusion_message = "Thank you so much for taking the time to talk with us today. We really enjoyed learning more about your background and the skills you bring to the role. We'll review everything and be in touch soon about the next steps. If you have any questions in the meantime, feel free to reach out. Have a great day!"
    #     return jsonify({"message": conclusion_message, "status_code": 408, "session_id": session_id}), 408

    interview_info = session_data["rules"]
    chat_history = session_data["chat_history"]
    resume_text = session_data["resume"]
    interview_type = session_data["type"]

    if "problems" in session_data:
        problems = session_data["problems"]
    else:
        problems = None
    print(problems)
    try:
        best_practices_file = supabase_client.storage.from_('ragfiles').download('answers_followup_questions.csv')
        best_practices_file = io.BytesIO(best_practices_file)
    except Exception as e:
        print('Error:', e)

    load_dotenv()

    embeddings = None
    credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

    if credentials_json:
        credentials_dict = json.loads(credentials_json)
        credentials = service_account.Credentials.from_service_account_info(credentials_dict)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", credentials=credentials)
    else:
        raise Exception("Service account credentials not found in environment variables")

    df = pd.read_csv(best_practices_file)
    texts = df[['Answer', 'Follow-Up Question']].agg(' '.join, axis=1).tolist()
    documents = [Document(page_content=text) for text in texts]

    db = FAISS.from_documents(documents, embeddings)
#     load_dotenv()

#     embeddings = None
# # Fetch the JSON string from the environment variable
#     credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

#     if credentials_json:
#         # Parse the JSON string into a dictionary
#         credentials_dict = json.loads(credentials_json)
        
#         # Use the dictionary to create credentials
#         credentials = service_account.Credentials.from_service_account_info(credentials_dict)

#         # Set the credentials as the default credentials
#         os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_json  # Optional, for other clients
        
#         # Initialize the Google Cloud client with the credentials
#         embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", credentials=credentials)

#     os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"D://Hackathons//CODERED'25//PREP2PRO//backend_prep2pro//gcpserviceacckey.json"
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     df = pd.read_csv(best_practices_file)
#     texts = df[['Answer', 'Follow-Up Question']].agg(' '.join, axis=1).tolist()
#     documents = [Document(page_content=text) for text in texts]
#     db = FAISS.from_documents(documents, embeddings)

    def retrieve_info(query):
        similar_response = db.similarity_search(query, k=3)
        page_contents_array = [doc.page_content for doc in similar_response]
        return page_contents_array

    best_practice = retrieve_info(user_answer)

    load_dotenv()
    GEMINI_KEY = os.getenv('GEMINI_KEY')
    genai.configure(api_key=GEMINI_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f'''
    You are a world-class interviewer with expertise in various technical domains. Your task is to frame a highly specific technical follow-up question based on the provided resources and context.
    
    Context:
    Interview Structure and Rules: {interview_info}
    Best Practices for Question Framing: {best_practice}
    Ensure questions align with the formal style provided, keeping them concise yet detailed where necessary.
    Chat History of the Interview So Far: {chat_history}
    This is the user's answer to your previous question : {user_answer}
    This is the user' resume :{resume_text}
    Current duration of the interview : {elapsed_time}
    If the user's response is a self-introduction and some clarification can be asked in that, feel free to ask that too but don't ask unnecessary questions.
    Pay particular attention to the user's answer to the last question when framing the follow-up.

    Instructions:
    Note: Restrict yourself from asking multiple questions at a time.
    Only ask follow up questions when you need clarification in user's response.
    Don't generate follow up questions with the current question, assess the user's response before asking a follow up.
    Assess the rules and resources carefully.
    Ensure the follow-up question is medium level technical, specific, and conceptually connected to the user's last response in the chat history.
    Maintain a formal tone and structure consistent with the provided best practices.
    The Questions should be short precise and difficulty should be medium level.
    The response from you should not start with "Given your " instead you various vocabulary.
    The response must consists of the response to the user's previous answer and then follow up or new question thats it.
    Don't add any headings or something. Just plain text.
    If you have met all the criteria to end the meeting based on the interview_rules  and the elapsed_time is greater than 30 then just respond "conclude"
    Please dont ask more than 2 follow ups. ask questions from different topics when you complete the follow ups.
    If there is problems below this line then go for the problems provided instead of the the resume based questions.
    '''
    if problems != None:
        prompt += f'''Here are the problems use should be including in this session{problems}'''
    try:
        response = gemini_model.generate_content(prompt)
    except Exception as e:
        print(f"Error occurred while fetching follow-up: {e}")
        return jsonify({"error": "No follow-up available"}), 500

    question = response.text

    if "conclude" in question:
        conclusion_message = "Thank you so much for taking the time to talk with us today. We really enjoyed learning more about your background and the skills you bring to the role. We'll review everything and be in touch soon about the next steps. If you have any questions in the meantime, feel free to reach out. Have a great day!"
        return jsonify({"message": conclusion_message, "status_code": 408, "session_id": session_id}), 408
    
    session_data["chat_history"].append({"role": "interviewer", "content": question})

    session_data_str = json.dumps(session_data)

    redis_client.hset(session_id, 'session_data', session_data_str)

    return jsonify({"question": question}), 200

@interview_bp.route('/improvements', methods=['POST'])
def generate_improvements():
    data = request.form
    session_id = data.get('session_id')

    if not session_id:
        return jsonify({"error": "Missing session ID"}), 400

    session_data_str = redis_client.hget(session_id, 'session_data')

    if session_data_str is None:
        return jsonify({"error": "Invalid session ID or missing session data"}), 404
    if isinstance(session_data_str, bytes):
        session_data_str = session_data_str.decode('utf-8')

    try:
        session_data = json.loads(session_data_str)
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding session data"}), 500

    chat_history = session_data["chat_history"]
    load_dotenv()
    GEMINI_KEY = os.getenv('GEMINI_KEY')
    genai.configure(api_key=GEMINI_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f'''
    You are an expert interviewer. Based on the following chat history, provide detailed and constructive improvement suggestions for the user in bullet points:
    {chat_history}
    '''

    try:
        response = gemini_model.generate_content(prompt)
        improvements = response.text
    except Exception as e:
        print(f"Error occurred while generating improvements: {e}")
        return jsonify({"error": "Could not generate improvements"}), 500

    redis_client.delete(session_id)

    return jsonify({"improvements": improvements}), 200
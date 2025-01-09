import PyPDF2
import google.generativeai as genai
import os
from flask import jsonify
from sentence_transformers import SentenceTransformer # type: ignore
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

def extract_text_from_pdf(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        
        for page in reader.pages:
            text += page.extract_text()
        
        return text

    except Exception as e:
        return f"Error in PDF extraction: {str(e)}"
    
def grammar_check(text):
    load_dotenv()
    GEMINI_KEY = os.getenv('GEMINI_KEY')
    genai.configure(api_key=GEMINI_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f'''
    This is the text of the resume's text: {text}
    Can you give me the grammatical error count in numbers?
    Just the number of errors.
    '''
    response = gemini_model.generate_content(prompt)
    errors = int(response.text)
    total_words = len(text.split())
    error_ratio = errors / total_words if total_words > 0 else 0 
    grammar_score = max(0, 30 * (1 - error_ratio))  
    return grammar_score

def layout_check(resume_text):
    layout_score = 0

    bullet_points = ['-', '*', '•']
    bullet_count = sum(1 for line in resume_text.splitlines() if line.strip().startswith(tuple(bullet_points)))
    if bullet_count > 5: 
        layout_score += 7 

    lines = resume_text.splitlines()
    blank_line_count = sum(1 for i in range(1, len(lines)) if lines[i].strip() == "" and lines[i - 1].strip() != "")
    if blank_line_count >= 4:  
        layout_score += 7  

    contact_keywords = ['email', 'phone', 'contact', '@']
    if any(keyword in resume_text.lower() for keyword in contact_keywords):
        layout_score += 6  

    return layout_score

def keyword_similarity(job_desc,resume_text):
    model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

    job_vec = model.encode([job_desc])
    resume_vec = model.encode([resume_text])

    similarity_score = cosine_similarity(job_vec, resume_vec)[0][0]

    return similarity_score

def improvement_suggestions_gemini(job_desc, resume_text):
    load_dotenv()

    GEMINI_KEY = os.getenv('GEMINI_KEY')
    genai.configure(api_key=GEMINI_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f'''Please review the following resume text ({resume_text}) in reference to the job description ({job_desc}). The review
should follow an interview-like feedback style, with everything based on the given resume text. Focus on the following key areas:

Bullet Points Usage:

Review: Check if bullet points are used in the resume to highlight achievements, responsibilities, or key skills. If they are used 
effectively, acknowledge the formatting. If not, suggest using bullet points for better readability and clarity.
Example (if no bullet points are used):
Experience:
Led a team to develop a full-stack web application. Worked with various stakeholders to design and implement features. Coordinated 
testing and deployment.
Suggested Change: Provide examples from the given resume text if suggesting changes.
Experience:
- Led a team to develop a full-stack web application.
- Worked with stakeholders to design and implement features.
- Coordinated testing and deployment.

Formal Writing Review:

Review: Assess the tone of the resume. It should be formal and professional. If the language is too casual, provide suggestions to 
make it more formal.
Example (if casual language is found in the resume text):
I really like working with teams and get things done quickly.
Suggested Change: Provide examples from the given resume text if suggesting changes.
Collaborated effectively with teams to deliver projects within deadlines.

Keyword Similarity:

Review: Compare the keywords in the resume text with the job description. Identify any missing keywords or areas where the resume 
could better match the job description.
Example: If the job description emphasizes "project management" and the resume text lacks it:
Job Description: "Looking for a candidate with strong project management skills."
Resume Text: "Managed a team to deliver software solutions."
Suggested Change: Provide examples from the given resume text if suggesting changes.
Resume Text: "Led and managed projects from conception to delivery, ensuring timely and successful completion."

Grammatical Errors:

Review: Identify any grammatical errors in the resume text. Correct the errors and suggest improvements.
Example (if grammatical errors are found in the resume text):
I am expert in JavaScript, Python, and Java.
Suggested Change: Provide examples from the given resume text if suggesting changes.
I am an expert in JavaScript, Python, and Java.

Metrics in Contributions:

Review: Check if there are any measurable metrics that demonstrate the candidate's contribution to previous roles (e.g., improved 
sales by 20%, reduced response time by 30%). If not, suggest adding such metrics where applicable.
Example (if no metrics are present in the resume text):
Led a project team and delivered a product.
Suggested Change: Provide examples from the given resume text if suggesting changes.
Led a project team of 10 members and delivered the product 15% ahead of schedule.

Contact Information:

Review: Ensure that the resume includes contact details (e.g., phone number, email). If no contact details are present, suggest
adding them.
Example (if contact info is missing in the resume text):
(No contact information present)
Suggested Change: Provide examples from the given resume text if suggesting changes.
Please include your contact details, such as:
- Phone number
- Email address

Additional Sections:

Review: Check if necessary sections like "Skills", "Projects", and "Education" are present. If not, suggest adding these headings.
Example (if sections are missing in the resume text):
Experience:
- Developed software applications using Python.
Suggested Change: Provide examples from the given resume text if suggesting changes.
Skills:
- Python, JavaScript, React

Just dont give response in headings or conversation just respond in sentences thats it.
Conclusion: Finally, based on the review of the provided resume text and job description, suggest any necessary changes to improve 
the resume and ensure it aligns well with the job description. Always base your suggestions and examples on the provided resume text,
 and provide clear and actionable feedback.'''

    try:
        response = gemini_model.generate_content(prompt)
        
        suggestions = response.text.strip() if hasattr(response, 'text') else "No suggestions available."

        suggestions_list = suggestions.split('. ')
        suggestions_list = [sentence.strip() + '.' for sentence in suggestions_list if sentence] 
        
        return suggestions_list
    except Exception as e:
        print(f"Error occurred while fetching suggestions: {e}")
        return ["No suggestions available."]
    
def evaluate_resume(resume_text, job_description):
    keyword_score = keyword_similarity(job_description,resume_text)
    grammar_score = grammar_check(resume_text)
    layout_score = layout_check(resume_text)
    total_ats_score = str((keyword_score * 50) + grammar_score + layout_score)
    suggestions = improvement_suggestions_gemini(job_description, resume_text)
    
    response = {
        "ats_score" : total_ats_score,
        "ats_score_breakdown" : {
            "keyword_score" : str(keyword_score),
            "grammar_score" : grammar_score,
            "layout_score" : layout_score
        },
        "suggestions" : suggestions,

    }
    return response
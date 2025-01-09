import PyPDF2 # type: ignore
import random
from app.supabase_client import supabase_client
import requests

def extract_text_from_pdf(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        
        for page in reader.pages:
            text += page.extract_text()
        
        return text

    except Exception as e:
        return f"Error in PDF extraction: {str(e)}"
    
def fetch_problem_details(title_slug):
    query = f"""
    {{
      question(titleSlug: "{title_slug}") {{
        title
        difficulty
        content
        exampleTestcases
      }}
    }}
    """

    url = "https://leetcode.com/graphql/"
    response = requests.post(
        url,
        json={'query': query}
    )

    if response.status_code == 200:
        data = response.json()
        return data
    
    else:
        print(f"Request failed with status code {response.status_code}")
        return None
       
def problems_SDE():
    count = [[1,1,0],[1,0,1],[0,2,0],[0,1,1]]
    random_ind = random.randint(0, 3)

    proportion = count[random_ind]
    rand1,rand2 = None,None
    if proportion[0] == 1 and proportion[1] == 1:
        rand1 = random.randint(27,40)
        rand2 = random.randint(1,26)
    if proportion[0] == 1 and proportion[2] == 1:
        rand1 = random.randint(27,40)
        rand2 = random.randint(41,50)
    if proportion[1] == 2:
        rand1 = random.randint(1,26)
        rand2 = random.randint(1,26)
    if proportion[1] == 1 and proportion[2] == 1:
        rand1 = random.randint(1,26)
        rand2 = random.randint(41,50)
    
    response1 = supabase_client.table("problems").select("name").eq("id", rand1).execute()
    response2 = supabase_client.table("problems").select("name").eq("id", rand2).execute()

    pb1,pb2 = response1.data[0]["name"],response2.data[0]["name"]
    pb1 = fetch_problem_details(pb1)
    pb2 = fetch_problem_details(pb2)
    return [pb1,pb2] 

def problems_DS():
    count = [[1,0],[0,1]]
    random_ind = random.randint(0, 1)

    proportion = count[random_ind]
    rand = None
    if proportion[0] == 1:
        rand = random.randint(27,40)
    else:
        rand = random.randint(1,26)
    
    response = supabase_client.table("problems").select("name").eq("id", rand).execute()

    pb = response.data[0]["name"]
    pb = fetch_problem_details(pb)
    return pb
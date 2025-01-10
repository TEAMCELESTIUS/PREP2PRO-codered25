# PREP2PRO - CODERED



**PREP2PRO** is an online placement-based platform dedicated to bridging the gap between traditional training methods and real-world interviews.

Some of the standout features : 

**Real-Time Response Based Questions :**

We have implemented an AI-driven system powered by **Retrieval-Augmented Generation (RAG)**, which asks contextually relevant follow-up questions based on user responses. Built on **Transformers, Pytorch, Faiss, and Sentence-Transformers**, this model enhances user interaction by providing dynamic, context-aware questioning, offering a **simulated one-on-one interview experience**. Prep2Pro uniquely handles an **audio-based** approach rather than the traditional typing method, implementing **Text-to-Speech (TTS) and Speech-to-Text (STT)**, giving candidates the chance to improve their soft skills.

**Domain Based Skilling :**

**Prep2Pro** provides a structured, guided pathway for a candidate to skill in **industry demanding skills**.  The platform offers a **well-defined roadmap**, helping users navigate through each stage of skill development with clear milestones. For each step, we provide a curated selection of resources, including both text-based materials and video content that are free !!

**Code Enhancement :**

While the code we provide serves as a foundation, it may not always be the most efficient. To address this, our **in-built code editor** helps users enhance their code by suggesting optimizations and improvements. 

**In-Built ATS Scanner :**

**Prep2Pro** features an ATS Scanner that analyzes your resume in comparison to a job description by a providing a score that reflects how well your resume matches the job requirements. Additionally, the scanner offers detailed, **step-by-step feedback** on areas to improve.


_______________________________________________________________________________________________________________________________________________________________________________________________________


**Setting up the Frontend**

Clone the Repository
```bash
git clone https://github.com/TEAMCELESTIUS/PREP2PRO-codered25.git
```

Navigate into the Directory
```bash
cd PREP2PRO-codered25
```


Install pnpm 
```bash
npm install -g pnpm
```

Install Required Packages
```bash
pnpm install
```

Run the Program
```bash
pnpm run dev
```

________________________________________________________________________________________________________________________________________________________________________________________________________

**Setting up the Backend**


Clone the Repository
```bash
git clone https://github.com/TEAMCELESTIUS/PREP2PRO-codered25.git
```

Navigate into the Directory
```bash
cd PREP2PRO-codered25
```

Set up a python virtual environment
```bash
python -m venv venv
```

For Activating (On Windows)
```bash
venv\Scripts\activate
```

On Linux
```bash
source venv/bin/activate
```

Install Required Modules
```
pip install -r"requirements.txt"
```

Run the Program
```
python main.py
```

_______________________________________________________________________________________________________________________________________________________________________________________________________

**Setting up Database**

Sign Up For Supabase and Set Up the Database to store

1. Authentication Details
2. Code Interview Questions
3. Personalized Information

Sign Up For RedisDB and Set Up the Database to store

1.Interview Related Session Information

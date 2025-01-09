from supabase import create_client # type: ignore
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials are not set in environment variables.")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
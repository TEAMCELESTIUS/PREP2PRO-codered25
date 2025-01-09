import redis
from dotenv import load_dotenv
import os 

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST") 
REDIS_PORT = os.getenv("REDIS_PORT")
# REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")

redis_client = redis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    # password=REDIS_PASSWORD,
    decode_responses=True  
)
from app.supabase_client import supabase_client
from flask import Blueprint, jsonify
from app.redis_client import redis_client

test_bp = Blueprint('testing',__name__)

@test_bp.route('/supabase',methods=['POST'])
def supabase_test():
    try:
        response = supabase_client.table("domains").select('*').execute()
        return jsonify(response.data), 200
    except:
        return jsonify({"error": "Error fetching data"}), 500


@test_bp.route('/redis',methods=['POST'])
def redis_test():
    try:
        test_key = "test_key"
        test_value = "Hello, Redis!"
        redis_client.set(test_key, test_value)
        print(f"Set key '{test_key}' with value '{test_value}'")

        retrieved_value = redis_client.get(test_key)
        print(f"Retrieved value for key '{test_key}': {retrieved_value}")

        return jsonify({
            "status": "success",
            "set_key": test_key,
            "set_value": test_value,
            "retrieved_value": retrieved_value
        }), 200
    except Exception as e:
        print(f"Error during Redis test: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
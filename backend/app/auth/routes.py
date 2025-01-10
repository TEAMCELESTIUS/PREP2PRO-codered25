from flask import request, jsonify, Blueprint
from app.supabase_client import supabase_client
from .utils import hash_password, verify_password, generate_token

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/signup', methods=['POST'])
def sign_up():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Email and password are required"}), 400

    hashed_password = hash_password(password)

    try:
        response = supabase_client.table('auth').insert({
            "username": username,
            "password": hashed_password
        }).execute()
    except Exception as e:
        return jsonify({"message": str(e)}), 500


    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    response = supabase_client.table('auth').select("*").eq("username", username).execute()

    # Access the `data` attribute directly
    users = response.data

    if not users or len(users) == 0:
        return jsonify({"message": "Invalid username or password"}), 401

    user = users[0]
    if not verify_password(user["password"], password):
        return jsonify({"message": "Invalid username or password"}), 401

    token = generate_token(user["id"])
    return jsonify({"token": token}), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

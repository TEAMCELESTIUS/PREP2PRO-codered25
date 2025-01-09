from flask import Blueprint, jsonify
from app.redis_client import redis_client
import redis

redis_bp = Blueprint('redis',__name__)

@redis_bp.route('/flushall', methods=['POST'])
def flush_all():
    try:
        redis_client.flushall()
        return jsonify({"status": "success", "message": "All keys flushed from Redis database"}), 200
    except redis.RedisError as e:
        return jsonify({"status": "error", "message": str(e)}), 500
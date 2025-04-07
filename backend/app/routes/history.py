from flask import Blueprint, jsonify, g
from app.models.chat import ChatMessage
from app.utils.token_required import token_required
from collections import defaultdict

history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
@token_required
def get_history():
    user_id = g.current_user_id

    # fetch all text according to timestamp
    chats = ChatMessage.query.filter_by(user_id=user_id).order_by(ChatMessage.timestamp.asc()).all()

    # classify according to sessions
    sessions = defaultdict(list)
    for chat in chats:
        sessions[chat.session_id].append({
            'user_message': chat.user_message,
            'bot_response': chat.bot_response,
            'timestamp': chat.timestamp.isoformat()
        })

    # JSON friendly
    grouped_history = []
    for session_id, messages in sessions.items():
        grouped_history.append({
            'session_id': session_id,
            'start_time': messages[0]['timestamp'],
            'messages': messages
        })

    return jsonify({'history': grouped_history})
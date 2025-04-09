import uuid
from datetime import datetime
from app.extensions import db

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    # Unique identifier for each message
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    user_id = db.Column(db.String, nullable=True)
    
    user_message = db.Column(db.Text, nullable=False)
    
    bot_response = db.Column(db.Text, nullable=False)
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique session ID to group messages in the same session
    chat_session_id = db.Column(db.String, nullable=False)

    def __init__(self, user_id, user_message, bot_response, chat_session_id):
        self.user_id = user_id
        self.user_message = user_message
        self.bot_response = bot_response
        self.chat_session_id = chat_session_id
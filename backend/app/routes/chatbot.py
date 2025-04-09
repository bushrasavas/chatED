import re
import random
from flask import Blueprint, request, jsonify
from app.models.model import chatbot_respond
from app.models.chat import ChatMessage
from app.extensions import db
from flask_jwt_extended import verify_jwt_in_request, jwt_required, get_jwt_identity
from app.models.model import chatbot_tokenizer, chatbot_model
import torch

chatbot_bp = Blueprint('chatbot', __name__)

safe_fallback_messages = [
    "I'm really sorry you're feeling this way. You are not alone. Please consider reaching out to a mental health professional or someone you trust. You deserve care, support, and nourishment.",
    "It sounds like you're going through something difficult. You're not alone, and support is available to you. Please take care of yourself and reach out to someone you trust.",
    "These thoughts can be overwhelming. Please know that you matter and support is out there. Talking to a professional can make a big difference.",
    "You are worthy of support, love, and care. If you're struggling, please speak to someone you trust or a mental health professional.",
    "It's okay to feel this way, but you don't have to go through it alone. Please reach out to someone who can help — you deserve it."
]

toxic_keywords = [
    "you have failed", "not worthy", "skip meals", "unacceptable", "punishment",
    "you should not eat", "starve", "fat", "ugly", "resist temptation", "you don't deserve", "stop eating"
]

danger_phrases = [
    "you are doing it wrong", "you may not be doing it correctly", "i am a licensed professional",
    "contact me", "reach out to me", "you should punish", "you must skip", "punish yourself",
    "eating only once a day", "you're not eating enough", "you deserve to feel guilty",
    "guilt is deserved", "eating disorders can be very easy to fight", "exercise to lose weight",
    "you should be stronger than food", "eating is a privilege"
]

def trim_repetitive_sentence_starts(response, max_repeats=2):
    sentence_starts = {}
    result = []

    sentences = re.split(r'(?<=[.!?])\s+', response.strip())

    for sentence in sentences:
        words = sentence.strip().lower().split()
        if len(words) < 2:
            result.append(sentence)
            continue

        start = " ".join(words[:2])
        sentence_starts[start] = sentence_starts.get(start, 0) + 1

        if sentence_starts[start] > max_repeats:
            break  # stop if there are 3 repeats 

        result.append(sentence)

    return " ".join(result).strip()

def clean_response(response):
    response = re.sub(r"\s{2,}", " ", response) 
    response = re.sub(r"\.\s+\.", ".", response)
    response = re.sub(r"\s+\.$", ".", response) 
    return response.strip()

def chatED_reply(prompt):
    greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]
    responses = [
        "Hi!", 
        "Hello!", 
        "Hello! I'm here to provide support with eating-related concerns. How can I help you today?"
    ]

    prompt_lower = prompt.strip().lower()
    if any(greeting in prompt_lower for greeting in greetings):
        return random.choice(responses)
    
    input_text = f"user: {prompt}\nbot:"
    
    input_ids = chatbot_tokenizer.encode(input_text, return_tensors="pt").to(chatbot_model.device)
    attention_mask = torch.ones_like(input_ids).to(chatbot_model.device)

    output_ids = chatbot_model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_new_tokens=50,
        pad_token_id=chatbot_tokenizer.eos_token_id,
        eos_token_id=chatbot_tokenizer.eos_token_id,
        do_sample=True,
        top_p=0.9,
        temperature=0.7,
        num_return_sequences=1,
        no_repeat_ngram_size=4
    )

    output_text = chatbot_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    response = output_text.replace(input_text, "").replace("bot:", "").strip().lower()

    for phrase in toxic_keywords + danger_phrases:
        if phrase in response:
            return random.choice(safe_fallback_messages)

    response = trim_repetitive_sentence_starts(response)
    response = clean_response(response)

    return response

@chatbot_bp.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_message = data.get("text", "")
    chat_session_id = data.get("chat_session_id")

    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
    except Exception as e:
        print("JWT verification error:", e)
        return jsonify({"error": "Unauthorized, please login"}), 401

    print(f"User ID: {user_id}, Session ID: {chat_session_id}")

    if not user_message.strip():
        return jsonify({"error": "No message received"}), 400

    bot_reply = chatED_reply(user_message)

    if user_id:
        chat_entry = ChatMessage(
            user_id=user_id,
            user_message=user_message,
            bot_response=bot_reply,
            chat_session_id=chat_session_id
        )
        db.session.add(chat_entry)
        db.session.commit()

    return jsonify({"response": bot_reply})

@chatbot_bp.route('/history', methods=['POST'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    print(f"Fetching history for: {user_id}")

    messages = ChatMessage.query.filter_by(user_id=user_id).order_by(ChatMessage.timestamp).all()

    grouped_history = {}
    for msg in messages:
        session_id = msg.chat_session_id or "unknown"
        if session_id not in grouped_history:
            grouped_history[session_id] = []
        grouped_history[session_id].append({
            "user_message": msg.user_message,
            "bot_response": msg.bot_response,
            "timestamp": msg.timestamp.isoformat()
        })

    return jsonify({"history": grouped_history})
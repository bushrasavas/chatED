from flask import Blueprint, request, jsonify
from app.models.model import predict

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def classify_tweet():
    data = request.json
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    prediction = predict(text)
    score = prediction [0][1]
    label = "ED" if score > 0.5 else "Non-ED"

    return jsonify({
        "label": label,
        "confidence": round(score,3)
    })

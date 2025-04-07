import os
from transformers import AutoModelForSequenceClassification, AutoTokenizer, AutoModelForCausalLM
import torch

TOKEN = os.getenv("HUGGINGFACE_TOKEN")

#ED prediction-roBERTa model
ED_MODEL_NAME = "busras/roBERTa_ED_Detection_3.3"

ed_tokenizer = AutoTokenizer.from_pretrained(ED_MODEL_NAME, use_auth_token=TOKEN)
ed_model = AutoModelForSequenceClassification.from_pretrained(ED_MODEL_NAME, use_auth_token=TOKEN)

print("Model is downloaded!")

# Chatbot Model (chatED-DialoGPT)
CHATBOT_MODEL_NAME = "busras/chatED-dialo-v5"
chatbot_tokenizer = AutoTokenizer.from_pretrained(CHATBOT_MODEL_NAME, use_auth_token=TOKEN)
chatbot_model = AutoModelForCausalLM.from_pretrained(CHATBOT_MODEL_NAME, use_auth_token=TOKEN)

print("Fine-tuned DialoGPT Model is downloaded!")

def predict(text):
    inputs = ed_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = ed_model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return probs.tolist()

chat_history = []
def chatbot_respond(user_message):
    global chat_history

    # Tokenize input message
    inputs = chatbot_tokenizer(user_message + chatbot_tokenizer.eos_token, return_tensors="pt", padding="max_length", truncation=True, max_length=512)
    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    print(f"Input IDs: {input_ids.shape}")
    print(f"Attention Mask: {attention_mask.shape}")

    # Add current input to chat history
    chat_history.append(input_ids)

    # Combine chat history
    chat_input = torch.cat(chat_history, dim=-1) if len(chat_history) > 1 else input_ids
    print(f"Chat Input Shape: {chat_input.shape}")

    # Check if combined length exceeds max length and trim if necessary
    while chat_input.shape[1] > 512:
        chat_history.pop(0)  # Remove the oldest token to fit the max length
        chat_input = torch.cat(chat_history, dim=-1)

    # Generate response using model
    output_ids = chatbot_model.generate(chat_input, max_new_tokens=50, pad_token_id=chatbot_tokenizer.eos_token_id, attention_mask=attention_mask)
    print(f"Output IDs: {output_ids.shape}")
    
    bot_reply = chatbot_tokenizer.decode(output_ids[:, chat_input.shape[-1]:][0], skip_special_tokens=True)

    # Add new response to history
    chat_history.append(output_ids)
    return bot_reply
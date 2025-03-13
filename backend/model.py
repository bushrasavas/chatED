import os
from transformers import AutoModelForSequenceClassification, AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "busras/roBERTa_ED_Detection_3.3"
TOKEN = os.getenv("HUGGINGFACE_TOKEN")

#ED prediction-roBERTa model


tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=TOKEN)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, token=TOKEN)

print("Model is downloaded!")

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return probs.tolist()



# import os
# from transformers import AutoModelForSequenceClassification, AutoTokenizer, AutoModelForCausalLM
# import torch

# TOKEN = os.getenv("HUGGINGFACE_TOKEN")

# #ED prediction-roBERTa model
# ED_MODEL_NAME = "busras/roBERTa_ED_Detection_3.3"
# ed_tokenizer = AutoTokenizer.from_pretrained(ED_MODEL_NAME, token=TOKEN)
# ed_model = AutoModelForSequenceClassification.from_pretrained(ED_MODEL_NAME, token=TOKEN)

# print("ED Model is downloaded!")

# #Chatbot Model-DialoGPT
# CHATBOT_MODEL_NAME = "microsoft/DialoGPT-medium"
# chatbot_tokenizer = AutoTokenizer.from_pretrained(CHATBOT_MODEL_NAME)
# chatbot_model = AutoModelForCausalLM.from_pretrained(CHATBOT_MODEL_NAME)

# print("DialoGPT Model is downloaded!")

# def predict(text):
#     inputs = ed_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
#     with torch.no_grad():
#         outputs = ed_model(**inputs)
#     probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
#     return probs.tolist()

# chat_history=[]

# def chatbot_respond(user_message):
#     global chat_history

#     try:
#         # **Ön yönerge ekleyerek chatbot'u yönlendir**
#         guiding_message = "The user may be struggling with a mental health issue. Respond in a supportive and empathetic way."
#         formatted_input = f"{guiding_message} {user_message}"

#         input_ids = chatbot_tokenizer.encode(formatted_input + chatbot_tokenizer.eos_token, return_tensors="pt")

#         chat_history.append(input_ids)
#         if len(chat_history) > 5:  
#             chat_history.pop(0)

#         chat_input = torch.cat(chat_history, dim=-1) if len(chat_history) > 1 else input_ids

#         output_ids = chatbot_model.generate(chat_input, max_length=1000, pad_token_id=chatbot_tokenizer.eos_token_id)
#         bot_reply = chatbot_tokenizer.decode(output_ids[:, chat_input.shape[-1]:][0], skip_special_tokens=True)

#         chat_history.append(output_ids)

#         return filter_response(bot_reply)
    
#     except Exception as e:
#         print(f"Chatbot Error: {e}")
#         return "I'm having trouble responding right now. Please try again later."

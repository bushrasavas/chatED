# ChatED

**ChatED** is a mobile application developed for my Final Year Project at Brunel University London. It detects Eating Disorder (ED)-related tweets using a fine-tuned NLP model and provides simple, supportive chatbot responses for users who may be at risk.

---

## Purpose

Eating disorders are serious and often under-recognised on social media. ChatED aims to:

- Detect tweets indicating disordered eating behaviours  
- Provide short, empathetic replies to promote early intervention  
- Raise awareness using responsible AI techniques  

---

## Features

- ED Tweet Detection using a RoBERTa-based classifier  
- Supportive chatbot responses (rule-based and filtered for safety)  
- Tweet simulation interface  
- JWT-based user authentication  
- Mobile app built with React Native (Expo)  

---

## Tech Stack

- **Frontend:** React Native (Expo)  
- **Backend:** Flask (Python)  
- **ML Model:** Hugging Face Transformers (RoBERTa)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Storage:** AsyncStorage  

---

## Getting Started

To run the full project:

```bash
# Clone the repository
git clone https://github.com/your-username/ChatED.git
cd ChatED

# --- Backend Setup ---
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                # Runs on http://localhost:5000

# --- Frontend Setup ---
cd ../frontend/chatED-app
npm install
# Create a .env file with the following line:
# API_BASE_URL=http://localhost:5000
npx expo start               # Launches the mobile app in Expo
```

---

## Model Overview

- **Transformer used:** RoBERTa (fine-tuned)  
- **Training data:** 2,000 manually labelled tweets (ED-related vs. non-ED)  
- **Preprocessing:** Three cleaning strategies tested, including hashtag handling and text normalization  
- **Best configuration:** RoBERTa with the third cleaning strategy (cleaned3)  
- **Validation accuracy:** ~61% on held-out test set  
- **Hosted model:**  
  [busras/roBERTa_ED_Detection_3.3](https://huggingface.co/busras/roBERTa_ED_Detection_3.3)  

---

## Authentication

- JWT token is issued on login  
- Token is stored in AsyncStorage  
- Automatically included in protected API requests  

---

## Acknowledgements

- The base transformer model was [roberta-base](https://huggingface.co/roberta-base) from Hugging Face.  
- Training data and preprocessing logic were partially adapted from the GitHub repository [jabenitez88/NLP-EatingDisordersBERT](https://github.com/jabenitez88/NLP-EatingDisordersBERT) by [Jorge A. Benitez].

---

## Author

**Busra Savas**  
Brunel University London – Final Year Project

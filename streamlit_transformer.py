import streamlit as st
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import torch

# Load fine-tuned model and tokenizer
model_dir = './distilbert-fake-news'
tokenizer = DistilBertTokenizerFast.from_pretrained(model_dir)
model = DistilBertForSequenceClassification.from_pretrained(model_dir)

label_map = {0: "Fake News", 1: "Not A Fake News"}

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=256)
    with torch.no_grad():
        outputs = model(**inputs)
        pred = torch.argmax(outputs.logits, dim=1).item()
    return label_map[pred]

st.set_page_config(page_title="Fake News Detector (Transformer)", page_icon="📰", layout="centered")
st.title("📰 Fake News Detector (Transformer)")
st.write("Enter news text below and click Predict to check if it is Fake or True.")

user_input = st.text_area("News Text", height=150)

if st.button("Predict"):
    if user_input.strip() == "":
        st.warning("Please enter some news text.")
    else:
        with st.spinner("Analyzing..."):
            result = predict(user_input)
        st.success(f"Prediction: {result}")

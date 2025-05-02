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

print("\nFake News Detector (Transformer)")
print("Type or paste news text and press Enter. Type 'exit' to quit.\n")

while True:
    user_input = input("You: ")
    if user_input.strip().lower() == 'exit':
        print("Goodbye!")
        break
    result = predict(user_input)
    print("AI:", result, "\n")
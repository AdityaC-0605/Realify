import requests
import pickle
import pandas as pd
import os
from utils import wordopt, output_lable

# --- CONFIG ---
SERPAPI_API_KEY = '0dc53a995f4ff0486f34f00b949f1f4932861c12a7da9922adfe7e023318c6d1'  # <-- Replace with your SerpApi key
SERPAPI_URL = f'https://serpapi.com/search.json?engine=google_news&q=latest+news&api_key={SERPAPI_API_KEY}'
# Model and vectorizer paths (assumes they are in the current directory)
MODEL_PATHS = {
    'LR': 'lr_model.pkl',
    'DT': 'dt_model.pkl',
    'GB': 'gb_model.pkl',
    'RF': 'rf_model.pkl',
}
VECTORIZER_PATH = 'vectorizer.pkl'

# --- LOAD MODELS ---
def load_models_and_vectorizer():
    models = {}
    for name, path in MODEL_PATHS.items():
        if os.path.exists(path):
            models[name] = pickle.load(open(path, 'rb'))
        else:
            print(f"Warning: Model {name} not found at {path}")
    if not os.path.exists(VECTORIZER_PATH):
        raise FileNotFoundError(f"Vectorizer not found at {VECTORIZER_PATH}")
    vectorizer = pickle.load(open(VECTORIZER_PATH, 'rb'))
    return models, vectorizer

# --- FETCH NEWS ---
def fetch_headlines():
    response = requests.get(SERPAPI_URL)
    data = response.json()
    if 'news_results' not in data:
        raise Exception(f"SerpApi error: {data.get('error', 'No news_results found')}")
    headlines = [article['title'] for article in data['news_results'] if article.get('title')]
    return headlines

# --- PREDICT ---
def predict_news(news_list, models, vectorizer):
    results = []
    for news in news_list:
        processed = wordopt(news)
        vect = vectorizer.transform([processed])
        preds = {name: output_lable(model.predict(vect)[0]) for name, model in models.items()}
        results.append({'headline': news, **preds})
    return results

# --- INTERACTIVE CHATBOT MODE ---
def chatbot_mode(models, vectorizer):
    print("\nFake News Detector Chatbot\nType or paste news text and press Enter. Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ")
        if user_input.strip().lower() == 'exit':
            print("Goodbye!")
            break
        processed = wordopt(user_input)
        vect = vectorizer.transform([processed])
        print("AI:")
        for name, model in models.items():
            pred = output_lable(model.predict(vect)[0])
            print(f"  {name} Prediction: {pred}")
        print()

# --- MAIN ---
def main():
    print("Loading models and vectorizer...")
    models, vectorizer = load_models_and_vectorizer()
    print("\nChoose mode:")
    print("1. Real-time Google News detection")
    print("2. Chatbot: Enter your own news text")
    mode = input("Enter 1 or 2: ").strip()
    if mode == '1':
        print("Fetching real-time news headlines...")
        headlines = fetch_headlines()
        print(f"Fetched {len(headlines)} headlines. Predicting...")
        predictions = predict_news(headlines, models, vectorizer)
        for item in predictions:
            print(f"\nHeadline: {item['headline']}")
            for model in models:
                print(f"  {model} Prediction: {item[model]}")
    elif mode == '2':
        chatbot_mode(models, vectorizer)
    else:
        print("Invalid selection.")

if __name__ == '__main__':
    main()

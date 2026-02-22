import os
import pickle
from pathlib import Path

import requests
from utils import wordopt, output_lable

# --- CONFIG ---
SERPAPI_API_KEY = os.getenv("SERPAPI_KEY", "")
SERPAPI_URL = "https://serpapi.com/search.json"
BASE_DIR = Path(__file__).resolve().parent

# Model and vectorizer paths
MODEL_PATHS = {
    "LR": BASE_DIR / "lr_model.pkl",
    "DT": BASE_DIR / "dt_model.pkl",
    "GB": BASE_DIR / "gb_model.pkl",
    "RF": BASE_DIR / "rf_model.pkl",
}
VECTORIZER_PATH = BASE_DIR / "vectorizer.pkl"

# --- LOAD MODELS ---
def load_models_and_vectorizer():
    models = {}
    for name, path in MODEL_PATHS.items():
        if path.exists():
            with path.open("rb") as f:
                models[name] = pickle.load(f)
        else:
            print(f"Warning: Model {name} not found at {path}")
    if not VECTORIZER_PATH.exists():
        raise FileNotFoundError(f"Vectorizer not found at {VECTORIZER_PATH}")
    with VECTORIZER_PATH.open("rb") as f:
        vectorizer = pickle.load(f)
    return models, vectorizer

# --- FETCH NEWS ---
def fetch_headlines():
    if not SERPAPI_API_KEY:
        raise RuntimeError("SERPAPI_KEY is not set")

    response = requests.get(
        SERPAPI_URL,
        params={
            "engine": "google_news",
            "q": "latest news",
            "api_key": SERPAPI_API_KEY,
        },
        timeout=10,
    )
    response.raise_for_status()
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

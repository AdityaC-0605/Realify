import requests
import pickle
import os
import numpy as np
from pathlib import Path
from utils import wordopt, output_lable

# --- CONFIG ---
SERPAPI_API_KEY = os.getenv("SERPAPI_KEY", "")
SERPAPI_BASE_URL = "https://serpapi.com/search.json"
BASE_DIR = Path(__file__).resolve().parents[2]

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
def fetch_headlines(keyword="latest news", limit=10):
    """Fetch news headlines from Google News via SerpAPI"""
    if not SERPAPI_API_KEY:
        print("SERPAPI_KEY is not set")
        return []

    try:
        params = {
            'engine': 'google_news',
            'q': keyword,
            'api_key': SERPAPI_API_KEY,
            'num': limit,
            'hl': 'en',
            'gl': 'us'
        }
        
        response = requests.get(SERPAPI_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'news_results' not in data:
            error_msg = data.get('error', 'No news_results found')
            print(f"SerpApi error: {error_msg}")
            return []
        
        headlines = []
        for article in data['news_results'][:limit]:
            if article.get('title'):
                headlines.append(article['title'])
        
        return headlines
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return []
    except Exception as e:
        print(f"Error fetching headlines: {e}")
        return []

# --- ENHANCED PREDICT ---
def predict_news_enhanced(news_list, models, vectorizer):
    """Enhanced prediction with confidence scores and ensemble voting"""
    results = []
    
    for news in news_list:
        processed = wordopt(news)
        vect = vectorizer.transform([processed])
        
        # Get predictions and probabilities from each model
        predictions = {}
        probabilities = {}
        confidence_scores = {}
        
        for name, model in models.items():
            # Get prediction
            pred_label = output_lable(model.predict(vect)[0])
            predictions[name] = pred_label
            
            # Get probability/confidence if available
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(vect)[0]
                confidence = max(proba)  # Confidence is the maximum probability
                confidence_scores[name] = round(confidence, 3)
            elif hasattr(model, 'decision_function'):
                # For models like SVM that have decision_function
                decision = model.decision_function(vect)[0]
                confidence = abs(decision)  # Distance from decision boundary
                confidence_scores[name] = round(min(confidence / 3, 1.0), 3)  # Normalize roughly
            else:
                # Fallback confidence score
                confidence_scores[name] = 0.75
        
        # Ensemble prediction (majority voting with confidence weighting)
        fake_votes = sum([1 for pred in predictions.values() if pred == "Fake News"])
        total_votes = len(predictions)
        
        if fake_votes > total_votes / 2:
            ensemble_pred = "Fake News"
        else:
            ensemble_pred = "Not A Fake News"
        
        # Calculate ensemble confidence
        ensemble_confidence = round(np.mean(list(confidence_scores.values())), 3)
        
        result = {
            'headline': news,
            'predictions': predictions,
            'confidence_scores': confidence_scores,
            'ensemble_prediction': ensemble_pred,
            'ensemble_confidence': ensemble_confidence
        }
        results.append(result)
    
    return results

# --- ORIGINAL PREDICT (for backward compatibility) ---
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
    print("\
Fake News Detector Chatbot\
Type or paste news text and press Enter. Type 'exit' to quit.\
")
    while True:
        user_input = input("You: ")
        if user_input.strip().lower() == 'exit':
            print("Goodbye!")
            break
        
        predictions = predict_news_enhanced([user_input], models, vectorizer)
        if predictions:
            result = predictions[0]
            print("AI Analysis:")
            print(f"  Ensemble Prediction: {result['ensemble_prediction']} (Confidence: {result['ensemble_confidence']})")
            print("  Individual Models:")
            for name, pred in result['predictions'].items():
                conf = result['confidence_scores'][name]
                print(f"    {name}: {pred} (Confidence: {conf})")
        print()

# --- MAIN ---
def main():
    print("Loading models and vectorizer...")
    models, vectorizer = load_models_and_vectorizer()
    print("\
Choose mode:")
    print("1. Real-time Google News detection")
    print("2. Chatbot: Enter your own news text")
    mode = input("Enter 1 or 2: ").strip()
    
    if mode == '1':
        keyword = input("Enter search keyword (or press Enter for 'latest news'): ").strip()
        if not keyword:
            keyword = "latest news"
        
        print(f"Fetching news for keyword: '{keyword}'...")
        headlines = fetch_headlines(keyword=keyword, limit=5)
        
        if not headlines:
            print("No headlines fetched. Using sample data.")
            headlines = ["Sample news headline for testing"]
        
        print(f"Analyzing {len(headlines)} headlines...")
        predictions = predict_news_enhanced(headlines, models, vectorizer)
        
        for result in predictions:
            print(f"\
Headline: {result['headline']}")
            print(f"Ensemble Prediction: {result['ensemble_prediction']} (Confidence: {result['ensemble_confidence']})")
            print("Individual Models:")
            for model, pred in result['predictions'].items():
                conf = result['confidence_scores'][model]
                print(f"  {model}: {pred} (Confidence: {conf})")
                
    elif mode == '2':
        chatbot_mode(models, vectorizer)
    else:
        print("Invalid selection.")

if __name__ == '__main__':
    main()

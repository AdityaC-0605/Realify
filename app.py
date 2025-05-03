from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

def get_serpapi_key():
    key_path = "serpapi_key.txt"
    if not os.path.exists(key_path):
        return None
    with open(key_path, "r") as f:
        return f.read().strip()

def fetch_google_news(query, serpapi_key):
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_news",
        "q": query,
        "api_key": serpapi_key
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        headlines = []
        if "news_results" in data:
            for article in data["news_results"]:
                if "title" in article:
                    headlines.append(article["title"])
        return headlines
    except Exception as e:
        return ["Error fetching news: " + str(e)]

@app.route('/get_headlines', methods=['POST'])
def get_headlines():
    data = request.get_json()
    news = data.get('news', '')
    serpapi_key = get_serpapi_key()
    if not serpapi_key:
        return jsonify({"error": "SerpAPI key not found."})
    headlines = fetch_google_news(news, serpapi_key)
    return jsonify({"headlines": headlines})

if __name__ == '__main__':
    app.run(debug=True)
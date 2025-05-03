from flask import Flask, render_template, request
from realtime_fake_news import load_models_and_vectorizer, fetch_headlines, predict_news

app = Flask(__name__)
models, vectorizer = load_models_and_vectorizer()

@app.route("/", methods=["GET", "POST"])
def index():
    user_news = ""
    user_prediction = None
    predictions = []
    if request.method == "POST":
        user_news = request.form.get("user_news", "")
        if user_news:
            processed = [user_news]
            user_prediction = predict_news(processed, models, vectorizer)[0]
    # Always fetch real-time headlines for display
    try:
        headlines = fetch_headlines()
        predictions = predict_news(headlines, models, vectorizer)
    except Exception as e:
        predictions = []
    return render_template(
        "index.html",
        user_news=user_news,
        user_prediction=user_prediction,
        predictions=predictions
    )

if __name__ == "__main__":
    app.run(debug=True)
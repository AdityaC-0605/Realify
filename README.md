
---

# 📰 Realify – Fake News Detector

**Realify** is a machine learning-powered fake news detection system that identifies whether a news article is real or fake. It includes a custom transformer that fetches live news from **Google News using SerpAPI**, enabling **real-time news verification**.

---

## 🧠 Algorithms Used

1. **Logistic Regression** – A linear model for binary classification.
2. **Decision Tree Classifier** – A tree-based model for simple and interpretable decisions.
3. **Random Forest Classifier** – An ensemble of decision trees for improved accuracy.
4. **Gradient Boosting Classifier** – Boosts weak learners for better performance.

---

## 📊 Dataset

* **Source**: [Kaggle Fake and Real News Dataset](https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset)
* **Columns**:

  * `title`: Headline of the news article
  * `text`: Main body/content of the article
  * `label`: Classification label (`FAKE` or `REAL`)

---

## 🌐 Real-Time News Integration

Realify includes a **custom news transformer** that:

* Fetches breaking news articles using the **Google News API** via **SerpAPI**
* Processes titles and article content through trained models
* Returns real-time predictions for each article

> 🔑 Set your SerpAPI key as an environment variable:

```bash
export SERPAPI_KEY=your_api_key_here
```

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/Realify.git
cd Realify
pip install -r requirements.txt
```

---

## 🚀 Usage

---

## 🧪 Example Output

```
Fetching articles for: elections 2024

1. "Government passes new education bill" → REAL
2. "Aliens confirmed in official UFO leak" → FAKE
```

---

## 📦 Requirements

* Python 3.7+
* scikit-learn
* pandas
* numpy
* requests
* serpapi

```bash
pip install -r requirements.txt
```

---

## 🙌 Acknowledgements

* [Kaggle Dataset: Fake and Real News](https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset)
* [SerpAPI](https://serpapi.com/) for Google News search integration

---

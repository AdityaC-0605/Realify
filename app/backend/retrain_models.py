#!/usr/bin/env python3
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import re
import string

# Text preprocessing function
def wordopt(text):
    text = str(text).lower()
    text = re.sub(r'\\[.*?\\]', '', text)
    text = re.sub(r"\\\\W", " ", text)
    text = re.sub(r'https?://\\S+|www\\.\\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\\w*\\d\\w*', '', text)
    return text

print("Creating sample training data...")

# Create sample training data (in a real scenario, you'd load from the Kaggle dataset)
fake_headlines = [
    "Scientists Discover Aliens Living Among Us in Secret Underground Bases",
    "Government Plans to Control Population Through Mind-Reading Chips in Vaccines",
    "Miracle Cure for All Diseases Found in Common Household Item",
    "Politicians Caught in Secret Meeting to Divide World Resources",
    "New Study Shows Drinking Water is Actually Dangerous for Health",
    "Breaking: Earth is Actually Flat According to New Satellite Images",
    "Technology Giants Plan to Replace All Humans with Robots by 2025",
    "Secret Society Controls All Major World Events from Hidden Location",
    "Scientists Confirm Time Travel is Possible Using Kitchen Appliances",
    "Government Hides Evidence of Immortality Serum from Public",
    "Experts Claim Sleeping More Than 2 Hours Daily Causes Death",
    "Revolutionary Diet Allows People to Live Without Food Forever",
    "Leaked Documents Show Weather is Artificially Controlled by Military",
    "New Research Proves Gravity is Just a Government Conspiracy",
    "Amazing Discovery: Plants Can Solve All Climate Change Problems Instantly"
]

real_headlines = [
    "Local Government Announces New Infrastructure Development Project Worth $10 Million",
    "University Researchers Publish Study on Climate Change Impact in Coastal Areas",
    "Technology Company Reports 15% Increase in Quarterly Revenue",
    "Healthcare System Implements New Digital Patient Record Management",
    "Transportation Department Plans Expansion of Public Transit Routes",
    "Environmental Agency Issues Guidelines for Renewable Energy Adoption",
    "Education Ministry Launches Initiative to Improve Rural School Facilities",
    "Agricultural Department Reports Successful Harvest Season Despite Weather Challenges",
    "Police Department Introduces Community Outreach Program for Crime Prevention",
    "Economic Council Forecasts Moderate Growth in Manufacturing Sector",
    "Medical Center Opens New Specialized Treatment Facility for Cancer Patients",
    "City Council Approves Budget for Park and Recreation Improvements",
    "Research Institute Collaborates with International Partners on Space Studies",
    "Public Health Officials Recommend Seasonal Vaccination Campaign",
    "Chamber of Commerce Hosts Small Business Development Workshop"
]

# Create training dataset
data = []
for headline in fake_headlines:
    data.append({'text': headline, 'label': 0})  # 0 = Fake
for headline in real_headlines:
    data.append({'text': headline, 'label': 1})  # 1 = Real

# Add more samples by duplicating with slight variations
extended_data = []
for item in data:
    extended_data.append(item)
    # Add variations
    text_variations = [
        item['text'],
        item['text'] + " according to recent reports",
        "Breaking: " + item['text'],
        item['text'] + " officials say",
        item['text'] + " experts confirm"
    ]
    for variation in text_variations:
        extended_data.append({'text': variation, 'label': item['label']})

df = pd.DataFrame(extended_data)
print(f"Created dataset with {len(df)} samples")
print(f"Fake news: {len(df[df['label'] == 0])}, Real news: {len(df[df['label'] == 1])}")

# Preprocess text
print("Preprocessing text...")
df['processed_text'] = df['text'].apply(wordopt)

# Split data
X = df['processed_text']
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Create and fit vectorizer
print("Creating TF-IDF vectorizer...")
vectorizer = TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train models
models = {
    'LR': LogisticRegression(random_state=42, max_iter=1000),
    'DT': DecisionTreeClassifier(random_state=42, max_depth=10),
    'RF': RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10),
    'GB': GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=5)
}

print("Training models...")
trained_models = {}
for name, model in models.items():
    print(f"Training {name}...")
    model.fit(X_train_tfidf, y_train)
    
    # Test accuracy
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"{name} accuracy: {accuracy:.3f}")
    
    trained_models[name] = model

# Save models
print("Saving models...")
for name, model in trained_models.items():
    filename = f"{name.lower()}_model.pkl"
    with open(filename, 'wb') as f:
        pickle.dump(model, f)
    print(f"Saved {filename}")

# Save vectorizer
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)
print("Saved vectorizer.pkl")

# Test loading
print("\
Testing model loading...")
try:
    for name in trained_models.keys():
        filename = f"{name.lower()}_model.pkl"
        with open(filename, 'rb') as f:
            loaded_model = pickle.load(f)
        print(f"✓ Successfully loaded {filename}")
    
    with open('vectorizer.pkl', 'rb') as f:
        loaded_vectorizer = pickle.load(f)
    print("✓ Successfully loaded vectorizer.pkl")
    
    # Test prediction
    test_text = ["Government announces new policy for better healthcare"]
    test_processed = [wordopt(text) for text in test_text]
    test_tfidf = loaded_vectorizer.transform(test_processed)
    
    print(f"\
Testing prediction on: '{test_text[0]}'")
    for name, model in trained_models.items():
        pred = model.predict(test_tfidf)[0]
        proba = model.predict_proba(test_tfidf)[0] if hasattr(model, 'predict_proba') else [0.5, 0.5]
        result = "Real News" if pred == 1 else "Fake News"
        confidence = max(proba)
        print(f"{name}: {result} (confidence: {confidence:.3f})")
        
    print("\
✅ All models trained and tested successfully!")
    
except Exception as e:
    print(f"✗ Error during testing: {e}")
    import traceback
    traceback.print_exc()
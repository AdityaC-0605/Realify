#!/usr/bin/env python3
import pickle
import numpy as np

# Test loading models
model_paths = {
    'LR': 'lr_model.pkl',
    'DT': 'dt_model.pkl', 
    'GB': 'gb_model.pkl',
    'RF': 'rf_model.pkl'
}

print("Testing model loading...")

try:
    # Load vectorizer first
    print("Loading vectorizer...")
    vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
    print(f"✓ Vectorizer loaded successfully")
    
    # Load models
    models = {}
    for name, path in model_paths.items():
        try:
            print(f"Loading {name} model...")
            models[name] = pickle.load(open(path, 'rb'))
            print(f"✓ {name} model loaded successfully")
        except Exception as e:
            print(f"✗ Failed to load {name} model: {e}")
    
    # Test prediction
    if models and vectorizer is not None:
        test_text = "This is a test news article"
        print(f"\
Testing prediction with: '{test_text}'")
        
        # Transform text
        vect = vectorizer.transform([test_text])
        print(f"✓ Text vectorized successfully, shape: {vect.shape}")
        
        # Test each model
        for name, model in models.items():
            try:
                pred = model.predict(vect)[0]
                print(f"✓ {name} prediction: {pred}")
            except Exception as e:
                print(f"✗ {name} prediction failed: {e}")
                
    print("\
Model testing completed!")
    
except Exception as e:
    print(f"✗ Critical error: {e}")
    import traceback
    traceback.print_exc()
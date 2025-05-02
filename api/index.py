from flask import Flask, request, jsonify
import finetune_transformer  # Import your script as a module

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run_finetune():
    # You can parse input from request.json if needed
    result = finetune_transformer.main()  # Or whatever function you want to run
    return jsonify({'result': result})

if __name__ == "__main__":
    app.run()
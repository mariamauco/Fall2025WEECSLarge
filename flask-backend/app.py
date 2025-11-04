from flask import Flask, request, Response, jsonify, stream_with_context
from ultralytics import YOLO

app = Flask(__name__)

filepath = 'best.pt'
model = YOLO(filepath)

# given an image, run the model and return a prediction
def predict(image):
    # TO IMPLEMENT
    return "Cardboard" #placeholder

# Route that handles API calls for predictions
# Given an image, use the model to run and return a prediction
@app.route('/predict', methods=['POST'])
def predict_route():
    img_file = None
    if 'image' in request.files:
        img_file = request.files['image']
        try:
            image_bytes = img_file.read()
        except Exception:
            image_bytes = request.files['image'].stream.read()
    else:
        image_bytes = request.get_data()
    # if no image was received
    if not image_bytes:
        return jsonify({'prediction': [], 'error': 'no image provided'}), 400
    # run the predict function and store response in preds
    try:
        preds = predict(image_bytes)
    except Exception as e:
        # return error message on model fail
        return jsonify({'prediction': [], 'error': f'model error: {str(e)}'}), 500

    return jsonify({'prediction': preds})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5055)
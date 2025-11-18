from flask import Flask, request, Response, jsonify, stream_with_context
from ultralytics import YOLO
from PIL import Image
import base64
import io

app = Flask(__name__)

filepath = 'best.pt'
model = YOLO(filepath)

# given an image, run the model and return a prediction
def predict(image_bytes, return_image=True):
    """Run YOLO on raw image bytes.
    Returns:
      detections: list of dicts
      a BytesIO JPEG with boxes drawn
    """
    
    # load image into PIL
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # run inference
    results = model.predict(img, imgsz=640, conf=0.35, verbose=False)
    r = results[0]
    names = r.names

    detections = []
    for b in r.boxes:
        cls = int(b.cls.item())
        detections.append({
            "class_id": cls,
            "class_name": names[cls],
            "confidence": float(b.conf.item()),
            "bbox_xyxy": [float(x) for x in b.xyxy[0].tolist()],
        })

    if return_image:
        # r.plot() returns BGR np.array; convert to RGB for PIL
        plotted = r.plot()[:, :, ::-1]
        buf = io.BytesIO()
        Image.fromarray(plotted).save(buf, format="JPEG", quality=90)
        buf.seek(0)
        return detections, buf

    return detections, None

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
        detections, buf = predict(image_bytes, return_image=True)
        # Count detections by class name
        material_counts = {}
        for d in detections:
            name = d["class_name"]
            material_counts[name] = material_counts.get(name, 0) + 1

        top_category = None
        if detections:
            top = max(detections, key=lambda x: x.get('confidence', 0))
            top_category = { 'label': top['class_name'], 'confidence': top['confidence'] }
        
        image_base64 = None
        if buf:
            buf.seek(0)
            image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            image_base64 = f"data:image/jpeg;base64,{image_base64}"

        
        return jsonify({
            "detections": detections,
            "counts": material_counts,
            "top_category": top_category,
            "annotated_image": image_base64
        })

    except Exception as e:
        return jsonify({
            "detections": [],
            "error": f"model error: {str(e)}"
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5055)

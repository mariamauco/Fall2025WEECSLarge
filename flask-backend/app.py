from flask import Flask, request, Response, jsonify, stream_with_context
from ultralytics import YOLO

app = Flask(__name__)

# load model


filepath = 'best.pt'
model = YOLO(filepath)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
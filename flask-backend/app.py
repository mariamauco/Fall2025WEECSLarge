from flask import Flask, request, Response, jsonify, stream_with_context
from ultralytics import YOLO

app = Flask(__name__)

# load model
model = YOLO("")

filepath = 'best.pt'

if __name__ == '__main__':
    app.run(port=5001)
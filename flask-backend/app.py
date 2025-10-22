from flask import Flask, request, Response, jsonify, stream_with_content
from ultralytics import YOLO

app = Flask(__name__)

# load model
model = YOLO("")

filepath = ''

if __name__ == '__main__':
    app.run(debug=True)

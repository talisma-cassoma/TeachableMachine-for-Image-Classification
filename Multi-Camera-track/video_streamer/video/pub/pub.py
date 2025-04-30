import cv2
import zmq
import base64

context = zmq.Context()
socket = context.socket(zmq.PUB)  # Publisher socket
socket.bind("tcp://*:5555")  # Bind to a port

camera = cv2.VideoCapture(0)  # Access the webcam

while True:
    ret, frame = camera.read()
    if not ret:
        break

    # Encode the frame and send it as a string
    _, buffer = cv2.imencode('.jpg', frame)
    frame_encoded = base64.b64encode(buffer)
    socket.send(frame_encoded)

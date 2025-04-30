import cv2
import zmq
import base64
import numpy as np

context = zmq.Context()
socket = context.socket(zmq.SUB)  # Subscriber socket
socket.connect("tcp://pub:5555")  # Connect to the publisher (replace "pub" with container name)
socket.setsockopt_string(zmq.SUBSCRIBE, "")  # Subscribe to all topics

while True:
    frame_encoded = socket.recv()  # Receive the frame
    frame_decoded = base64.b64decode(frame_encoded)
    np_frame = np.frombuffer(frame_decoded, dtype=np.uint8)
    frame = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)

    # Display the received frame
    cv2.imshow("Subscriber", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

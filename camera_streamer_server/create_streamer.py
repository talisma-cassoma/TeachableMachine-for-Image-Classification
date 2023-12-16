import cv2
import errno
import imagezmq
import os
import socket

def create_streamer(camera_index=0, conn ect_to='tcp://127.0.0.1:5555', loop=True):
    """
    You can use this function to emulate an IP camera for the counting apps.

    Parameters
    ----------
    camera_index : int, optional
        Index of the camera to capture images from. Default is 0, which is usually the built-in camera.
    connect_to : str, optional
        Where the video shall be streamed to. The default is 'tcp://127.0.0.1:5555'.
    loop : bool, optional
        Whether the video shall be looped. The default is True.

    Returns
    -------
    None.

    """
    # Open the camera
    cap = cv2.VideoCapture(camera_index)
    
    # check if camera opened successfully
    if not cap.isOpened():
        raise Exception("Error: Could not open camera.")

    # prepare streaming
    sender = imagezmq.ImageSender(connect_to=connect_to)
    host_name = socket.gethostname()

    while True:
        ret, frame = cap.read()

        if ret:
            # if a frame was returned, send it
            sender.send_image(host_name, frame)
        else:
            # if no frame was returned, either restart or stop the stream
            if loop:
                cap = cv2.VideoCapture(camera_index)
                if not cap.isOpened():
                    raise Exception("Error: Could not open camera.")
            else:
                break

if __name__ == '__main__':
    streamer = create_streamer()

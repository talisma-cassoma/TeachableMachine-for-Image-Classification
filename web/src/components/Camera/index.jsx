import './Camera.css'
import cameralogo from '../../assets/camera.svg'
import trainLogo from '../../assets/startTrain.svg'
import trainButtonLogo from '../../assets/trainButton.svg'
import React, { useRef, useEffect, useContext, useMemo } from 'react';
import { socket } from '../../utils/websocket';
import { CapturedFrameContext } from '../../hooks/capturedFrameContext';

export function Camera() {

  const { capturedFrame, predictions } = useContext(CapturedFrameContext);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null)

  useEffect(() => {
    startVideo();
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {

      const videoWidth = 640;
      const videoHeight = 480;

      webcamRef.current.width = videoWidth;
      webcamRef.current.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(webcamRef.current, 0, 0, videoWidth, videoHeight);

      ctx.clearRect(0, 0, videoWidth, videoHeight);
      setInterval(() => {
        socket.emit('camera stream',
          canvasRef.current.toDataURL('image/webp'));
      }, 120);
    }
  }, [])
  useMemo(() => {

  }, [capturedFrame])
  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        webcamRef.current.srcObject = currentStream
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <section className='videoPlay'>
      <video crossOrigin="anonymous" ref={webcamRef} autoPlay></video>
      <canvas ref={canvasRef}></canvas>
      <div className="navBar">
        <div id="enableCam" className="camera icon" >
          <img src={cameralogo} alt="camera icon" />
        </div>
        <div className="enablePredictionButton camera icon">
          <img src={trainLogo} alt="start train icon" />
        </div>
        <a className="train camera icon" href="/train">
          <img src={trainButtonLogo} alt="train icon" />
        </a>
      </div>
    </section>
  )
}
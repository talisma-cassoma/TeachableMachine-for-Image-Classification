import './Camera.css'
import cameralogo from '../../assets/camera.svg'
import trainLogo from '../../assets/startTrain.svg'
import trainButtonLogo from '../../assets/trainButton.svg'
import React, { useRef, useEffect, useContext } from 'react';
import Webcam from "react-webcam";
import { CapturedFrameContext } from '../../hooks/capturedFrameContext'


export function Camera() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { setCapturedFrame } = useContext(CapturedFrameContext);

  useEffect(() => {
    let animationFrameId;

    const processFrame = () => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const videoElement = webcamRef.current.video;
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
        const capturedFrame = ctx.getImageData(0, 0, videoWidth, videoHeight);
        
        
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        ctx.putImageData(capturedFrame, 0, 0);
        setCapturedFrame(capturedFrame)
        //console.log(capturedFrame)
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    processFrame(); // Start the animation loop

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on component unmount
  }, []);

  return (
    <section className='videoPlay'>
      <Webcam id="webcam" ref={webcamRef} autoPlay playsInline muted />
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
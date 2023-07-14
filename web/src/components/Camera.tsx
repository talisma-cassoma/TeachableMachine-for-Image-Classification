import './Camera.css'
import cameralogo from '../assets/camera.svg'
import trainLogo from '../assets/startTrain.svg'
import trainButtonLogo from '../assets/trainButton.svg'

export function Camera(){
  return (
    <section className='videoPlay'>
    <video id="webcam" autoPlay muted></video>
    <div className="navBar">
        <div id="enableCam" className="icon">
        <img src={cameralogo} alt="camera icon" />
        </div>
        <div className="enablePredictionButton icon">
        <img src={trainLogo} alt="start train icon" />
        </div>
        <a className="train icon" href="/train">
            <img src={trainButtonLogo} alt="train icon" />
        </a>
    </div>
</section>
  )
 }
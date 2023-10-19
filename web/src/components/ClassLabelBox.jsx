import imageIcon from '../assets/imageIcon.svg'
import imagesCollectedIcon from '../assets/imagesCollectedIcon.svg'
import { gatherDataForClass } from "../gatherDataForClass.js";

export function ClasslabelBox(prop){

  
  return(
    <article className="classObject">
    <div className="header">
      <span>{prop.classLabelName}</span>
      <img src={imageIcon} alt="" />
    </div>
    <div className="body">
      <div>hold the button to capure the images for train</div>
      <div className="imagesCollected">
        <div className="icon dataCollector" 
        onMouseDown={gatherDataForClass} onMouseUp={gatherDataForClass}
        data-1hot={prop.index} data-name={prop.classLabelName}>
          <img src={imagesCollectedIcon} alt="" />
          <span>webcam</span>
        </div>
          <div className="progessBar">
          <div className="progress" style={{ backgroundColor: 'palegreen' }}>
            --no prediction--
          </div>
        </div>
        <div className="numberOfImagesCollected">
          0
        </div>
      </div>
    </div>
  </article>
  ) 
}
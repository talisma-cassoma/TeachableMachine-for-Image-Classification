import { useContext } from 'react';
import imageIcon from '../assets/imageIcon.svg'
import imagesCollectedIcon from '../assets/imagesCollectedIcon.svg'
import { gatherDataForClass } from "../gatherDataForClass.js";
import { CapturedFrameContext } from '../hooks/capturedFrameContext';

export function ClasslabelBox(prop){

  const { capturedFrame } = useContext(CapturedFrameContext);

  const handleMouseDown = (event) => {
    gatherDataForClass(event, capturedFrame);
  }

  const handleMouseUp = (event) => {
    gatherDataForClass(event, capturedFrame);
  }

  return (
    <article className="classObject">
    <div className="header">
      <span>{prop.classLabelName}</span>
      <img src={imageIcon} alt="" />
    </div>
    <div className="body">
      <div>hold the button to capure the images for train</div>
      <div className="imagesCollected">
        <div className="icon dataCollector" 
        onMouseDown={handleMouseDown} 
        onMouseUp={handleMouseUp}
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
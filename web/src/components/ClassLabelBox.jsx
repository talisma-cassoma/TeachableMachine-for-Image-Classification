import imageIcon from '../assets/imageIcon.svg'
import imagesCollectedIcon from '../assets/imagesCollectedIcon.svg'

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
        <div className="icon dataCollector" data-1hot="0" data-name="HDJJADJAD">
          <img src={imagesCollectedIcon} alt="" />
          <span>webcam</span>
        </div>
        <div className="numberOfImagesCollected">
          0
        </div>
      </div>
    </div>
  </article>
  ) 
}
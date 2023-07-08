
const Camera = {

  videoPlaying: false,
  VIDEO : document.getElementById("webcam"),
  ENABLE_CAM_BUTTON: document.getElementById('enableCam'),
  MOBILE_NET_INPUT_WIDTH : 224,
  MOBILE_NET_INPUT_HEIGHT: 224,
  
  init (){
  this.ENABLE_CAM_BUTTON
    .addEventListener('click', this.enable);
  },

  hasGetUserMedia(){
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },

  enable() {
     if (Camera.hasGetUserMedia()){
      // getUsermedia parameters.
      const constraints = {
        video: true,
        width: 640, 
        height: 480 
      }
       // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      Camera.VIDEO.srcObject = stream;
      Camera.VIDEO.addEventListener('loadeddata', function() {
        Camera.videoPlaying = true;
        Camera.ENABLE_CAM_BUTTON.classList.add('removed');
      });
    });
    }else {
      console.warn("getUserMedia() is not supported by your browser");
    }
  },

  disable(){
 // TODO: Fill this out later in the codelab!
  }
}

export { Camera  }
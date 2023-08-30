import Camera from "./camera.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"


const camera = await Camera.init()
const factory = {
  async initialize() {
    return Controller.initialize({
      camera
    })
  }
}

export default factory
import { Camera } from "./camera.js";
import { Prediction } from "./loadModel.js";
// Main App module to initialize the camera, models, and prediction loop

const App = {
  async init() {
      Camera.init(); // Initialize camera
      await Prediction.loadModel(); // Load AI model
      const worker = new Worker("./scripts/loadModel.js", {type: "module"});

      Prediction.enable(); // Enable prediction loop on button click
  },
};

App.init(); // Start the app by initializing everything
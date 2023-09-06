 import { identifyPerson, canvasContext, canvasElement } from "./predictionsFunctions.js";

function drawSquareOnCanvas(x, y, size, color, text) {

  canvasContext.beginPath();
  canvasContext.rect(x, y, size.width, size.height);
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = 1;
  canvasContext.stroke();

  if (text) {
    canvasContext.fillStyle = color;
    canvasContext.font = '8px Arial';
    canvasContext.fillText(text, x + 5, y + 10);
  }
}

export default async function drawFrameWithBoundingBoxes(frame) {
  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const { image, predictions } = frame;

  canvasContext.putImageData(image, 0, 0);

  await predictions.forEach((prediction) => {
    let text = '';
    const { bbox, class: className } = prediction;

    if (className == "person") {
      const imageData = canvasContext.getImageData(bbox[0], bbox[1], bbox[2], bbox[3]);
      text = identifyPerson(imageData);
    } else {
      text = `${className}: ${Math.floor(prediction.score * 100)}% confidence`;
    }

    drawSquareOnCanvas(bbox[0], bbox[1], { width: bbox[2], height: bbox[3] }, 'red', text);
  });
}


 
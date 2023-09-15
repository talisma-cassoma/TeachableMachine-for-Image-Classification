const canvasElement = document.getElementById("myCanvas");
const canvasContext = canvasElement.getContext("2d", { willReadFrequently: true });

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

export async function drawFrameWithBoundingBoxes(frame) {
  await canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const { image, predictions } = frame;

  await canvasContext.putImageData(image, 0, 0);

  for (const prediction of predictions) {
    const { bbox, class: className } = prediction;

    let text = `${className}: ${Math.floor(prediction.score * 100)}% confidence`;

    drawSquareOnCanvas(
      bbox[0], 
      bbox[1], 
      { width: bbox[2], height: bbox[3] }, 
      'red', 
      text
    );

    // Add a delay of 100 milliseconds (adjust as needed)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
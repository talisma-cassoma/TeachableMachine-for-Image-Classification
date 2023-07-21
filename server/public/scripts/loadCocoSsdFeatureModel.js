import { Camera } from "./camera.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//cocoSsdModel variable
let cocoSsdModel = undefined;

// Array to store square data
let squares = [];

// Function to draw a single square
function drawSquare(x, y, size, color) {
	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = color;
	ctx.rect(x, y, size.width, size.height);
	ctx.stroke();
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	cocoSsdModel.detect(Camera.VIDEO).then(function (predictions) {
		squares = predictions.map( (prediction) =>{
			return {
				classNames: prediction.class,
					score: `${Math.round(parseFloat(prediction.score) * 100)} % confidence`,
					xPosition: prediction.bbox[0],
					yPosition: prediction.bbox[1],
					size: {
						width: prediction.bbox[2],
						height: prediction.bbox[3]
					},
					color: "red"
			}
		} )
	})
	//draw in canvas 
	squares.forEach(square => {
		drawSquare(square.xPosition, square.yPosition, square.size, square.color);
	});
}

// Render the squares and video stream
function renderFrame() {
	if (Camera.videoPlaying) {
		ctx.drawImage(Camera.VIDEO, 0, 0, canvas.width, canvas.height);
		render();
	}
	requestAnimationFrame(renderFrame);
}

async function loadCoco(){
  await cocoSsd.load().then(function (loadedModel) {
    cocoSsdModel = loadedModel;
  });
}


export { renderFrame, loadCoco }
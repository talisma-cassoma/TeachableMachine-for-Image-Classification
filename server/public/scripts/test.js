const demosSection = document.getElementById('demos');
// Get the video element and canvas element
const video = document.getElementById("video");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//model variable
var model = undefined;

// Array to store square data
let squares = [];
function classifyFrame(frame){
return
}

// Function to draw a single square
function drawSquare(x, y, size, color) {
	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = color;
	ctx.rect(x, y, size.width, size.height);
	ctx.stroke();
}

// Function to render all squares
function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	model.detect(video).then(function (predictions) {
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

// Set canvas size to match the video stream size
video.addEventListener('loadedmetadata', () => {
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
});

// Render the squares and video stream
function renderFrame() {
	if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		render();
	}
	requestAnimationFrame(renderFrame);
}

// Access the camera stream and start rendering
async function startCamera() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video.srcObject = stream;
		video.play();
		renderFrame();
	} catch (err) {
		console.error("Error accessing camera:", err);
	}
}

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.
cocoSsd.load().then(function (loadedModel) {
	model = loadedModel;
	// Show demo section now model is ready to use.
	demosSection.classList.remove('invisible');
	// Start the camera stream
	startCamera();
});

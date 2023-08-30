self.addEventListener("message", (event) => {
    if (event.data.type === "startPrediction") {
        const { imageData, width, height } = event.data;

        // Create an ImageData object using the received image data, width, and height
        const receivedImageData = new ImageData(new Uint8ClampedArray(imageData), width, height);

        // Perform image preprocessing here
        const preprocessedTensor = preprocessImage(receivedImageData);

        // Send back the preprocessed tensor to the main thread
        self.postMessage({ type: "preprocessedData", data: preprocessedTensor });
    }
});

function preprocessImage(imageData) {
    // Perform image processing operations here
    const videoFrameAsTensor = tf.browser.fromPixels(imageData).div(255);
    const resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH], true);

    return resizedTensorFrame;
}

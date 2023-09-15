# Teachable Machine

<img src="server/public/assets/favicon.svg" alt="app logo" width="50" height="50">

Teachable Machine is a web application that enables real-time object detection and classification using TensorFlow.js. This project consists of two main tasks: **training** and **prediction**.

## Features

### Training Task

The training task allows you to build and train a custom model for classification using your webcam as the data source. Here are some key features:

- **Model Architecture**: The training process involves building a sequential model with a dense layer and a softmax activation function.
- **Training Data**: The app captures data from the webcam, which is then processed and used for training.
- **Model Compilation**: The model is compiled with the Adam optimizer and an appropriate loss function based on the number of classes.
- **Training Progress**: During training, progress logs are displayed, providing insights into each epoch's performance.
- **Live Predictions**: Once the model is trained, it can make live predictions on the webcam feed.

<img src="server/public/assets/train.png" alt="Training page" width="50%" height="50%">

### Prediction Task

The prediction task involves real-time object detection and classification. Here are some key features:

- **Object Detection**: The app uses a pre-trained Coco-SSD model for object detection on the live video stream.
- **Classification**: Additionally, it employs a custom-trained model for classifying detected objects.
- **Real-time Rendering**: Detected objects and their predictions are displayed in real-time on an HTML canvas element.

<img src="server/public/assets/FIFO_without_web_workers.gif" alt="Predictions gif" width="50%" height="50%">

## Setting Up the Project

This project can be easily set up using Docker. The application's backend, which handles server-related tasks such as saving and uploading trained models, is built on Node.js. However, all training and prediction processes occur in the frontend.

### Automate Setup with Docker Image

To simplify the setup process for your clients, I have created a Docker image named `talisma/teachable-machine`. They can use the following command to set up the project:

```bash
docker run -p 3000:3000 talisma/teachable-machine
```

This command will pull the image from Docker Hub and run it as a container, making the application accessible at <http://localhost:3000>.

## Debugging Branch

A debugging branch has been implemented to enhance performance. In this version, web workers are utilized to handle all prediction tasks, while the main thread is responsible for rendering video frames and drawing bounding boxes.

To switch to the debugging branch, use the following command:

```bash
git checkout debugging
```

For additional details and customization options, refer to the code files provided in this project.

import express from 'express';
const routes = express.Router();

import { Labels } from './labels.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/** Require multer */
import multer from "multer"
const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'public/assets/uploads/')
    },
    filename: function (request, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname)
    }
})
const upload = multer({ storage: storage })

// Define an express route with multer middleware
routes.post('/upload',
    upload.fields([
        { name: 'model.json', maxCount: 1 },
        { name: 'model.weights.bin', maxCount: 1 }
    ]),
    (request, response) => {
        // request.body contains the text fields
        // request.files contains the file fields
        // Do something with the files and the body
        console.log(request.fieldname, request.body, request.files)
        response.send('Files uploaded to server')
    })

routes.get('/', (resquest, response) => {
    return response.sendFile(__dirname + "/views/index.html")
})

routes.get('/train', (resquest, response) => {
    return response.sendFile(__dirname + "/views/train.html")
})


 routes.post('/train/labels', async (request, response) => {
    const labels = await Labels.save(request.body)
    console.log(request.body)
    return response.status(201).send();
 })

routes.get('/train/labels', async (request, response) => {
    const labels = await Labels.read()
    response.json(labels)
})

export { routes, __dirname }
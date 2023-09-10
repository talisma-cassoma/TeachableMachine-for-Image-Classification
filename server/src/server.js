
import express from 'express';
import {routes, __dirname} from "./routes.js"

import cors from "cors"

import path from 'path';


const server = express()

server.use(cors())

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//habilitar arquivos statics
server.use(express.static("public"))

// usar o req.body
server.use(express.urlencoded({ extended: true }))

//allowing json
server.use(express.json());
// routes
server.use(routes)

server.listen(3000, async () => {

    console.log('rodando')
})

import express from 'express';
import {routes, __dirname} from "./routes.js"
import open from "open"
import cors from "cors"

import path from 'path';


const server = express()

server.use(cors())
// usando template engine
//server.set('view engine',  'ejs')

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

    await open('http://localhost:3000');
    console.log('rodando')
})
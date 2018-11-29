const express = require('express')
const h2 = require('https')
const fs = require('fs')
const morgan = require('morgan')
const http = require('http').Server
const {getWifiNetworks,getTemprature} = require('../scripts')
const InitSocketIo = require('./socket.io')
const options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};
TempEvent = getTemprature();
const app = express()
app.use(morgan('dev'))
const server = h2.createServer(options,app)
InitSocketIo(server,TempEvent)
app.get('/',(req,res)=>{
    getWifiNetworks().then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(500).send(err.message)
    })
})

app.get('/test',(req,res)=>{
    return res.sendFile(__dirname +"/public/index.html")
})

server.listen(1212,(err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log("Temprature server running on port:1212")
})
#! /usr/bin/env node

const express = require('express')
const h2 = require('https')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const http = require('http').Server
const {getWifiNetworks,getTemprature} = require('../scripts')
const InitSocketIo = require('./socket.io')
const options = {
    key: fs.readFileSync(path.join(__dirname,'./file.pem')),
    cert: fs.readFileSync(path.join(__dirname,'./file.crt'))
};
TempEvent = getTemprature();
const app = express()
app.use(morgan('dev'))
//const server = h2.createServer(options,app)
const httpServer = http(app)
InitSocketIo(httpServer,TempEvent)
app.get('/wifi-networks',(req,res)=>{
    getWifiNetworks().then(result=>{
        res.json(result)
    }).catch(err=>{
        res.status(500).send(err.message)
    })
})

app.get('/test',(req,res)=>{
    return res.sendFile(__dirname +"/public/index.html")
})
app.get('/status',async (req,res)=>{
    try {
        let data = await new Promise((resolve,reject)=>{
            let reading = getTemprature(null,1);
            reading.on('data',info=>resolve(JSON.parse(info)))
            reading.on('error',err=>reject(JSON.parse(err)))
        })
        res.json(data,
        )
    } catch (err) {
        res.status(500).json({message:err.message,status:false})
    }
})
app.get('/',(req,res)=>{
    return res.json({
        status:true,
        msg:"Welcome to TempMeter"
    })
})

httpServer.listen(1212,(err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log("Temprature server running on port:1212")
})

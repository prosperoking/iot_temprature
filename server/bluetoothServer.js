#! /usr/bin/env node
const SerialPort = require('serialport');

const btSerialPort = new SerialPort("/dev/rfcomm0",{
    baudRate:9600,
})

btSerialPort.open((err)=>{
    if(err)
        return console.log(err)
    let data = btSerialPort.read()

    console.log(data);
})
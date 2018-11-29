const {getTemprature} = require('./index')

let temprature = getTemprature(null,4)

temprature.on('data',(data)=>{
    console.log("this is from the callback: ",data);
})

temprature.on('error',(data)=>{
    console.log("this is from the callback: ",data);
})
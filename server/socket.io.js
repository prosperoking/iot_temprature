const socket = require('socket.io');
const webSocket = require('ws');
/**
 * @param {NodeJS.EventEmitter} TempEvent
 * @param {any} server
 */
module.exports = (server,TempEvent)=>{
    const io = socket(server)
    const ws = new webSocket.Server({server})
    ws.on('connection',webSocket=>{
        console.log('Websocket connected')
        webSocket.send(JSON.stringify({
                type:"msg",
                msg:"Connection sucessfull"
            })
        )
        const events = ['data','error']
        events.forEach(event=>{        
            let oldData = null
            TempEvent.on(event,data=>{
                try {
                    /* if(oldData !=data){
                        webSocket.send(JSON.stringify({
                            type:"data",
                            data,
                        }))
                        oldData=data; 
                    } */
                    webSocket.send(JSON.stringify({
                        type:"data",
                        data,
                    }))
                } catch (error) {
                    
                }
            })
        })
        
    })
}
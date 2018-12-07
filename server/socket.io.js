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
            TempEvent.on(event,_data=>{
                try {
                    //if(oldData !=_data){
                        webSocket.send(_data)
                        oldData=_data; 
                    //}
                } catch (error) {
                    
                }
            })
        })
        
    })
}
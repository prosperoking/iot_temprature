const socket = require('socket.io');

/**
 * @param {NodeJS.EventEmitter} TempEvent
 * @param {any} server
 */
module.exports = (server,TempEvent)=>{
    const io = socket(server)
    
    io.on('connection',webSocket=>{
        const events = ['data','error']
        events.forEach(event=>{        
            let oldData = null
            TempEvent.on(event,_data=>{
                try {
                    if(oldData !=_data){
                        webSocket.emit(`temp_${event}`,JSON.parse(_data))
                        oldData=_data; 
                    }
                    
                } catch (error) {
                    
                }
            })
        })
        
    })
}
const util = require('util');
const { exec, spawn} = require('child_process');
const path = require('path')
const shellExec = util.promisify(exec);
const CustomEvent = require('./event')

module.exports.shellExec = shellExec;

module.exports.getTemprature = (callback=null,maxCount=null)=>{
    let args = maxCount?['--c',`${maxCount}`]:[];
    const cmd = spawn(path.join(__dirname,'python/getTemp.py'),args)
    const _Event = new CustomEvent()
    cmd.stdout.on('data',(_data)=>{
        const data = _data.toString()
        if(callback) callback({data});
        _Event.emit('data',data)
    });

    cmd.stderr.on('data',(_err)=>{
        const err = _err.toString()
        console.log(err)
        if(callback) callback({err})
        _Event.emit('error',err)
    })

    return _Event
}

module.exports.getWifiNetworks = async ()=>{
    //return shellExec(`sudo -S iw dev wlan0 scan | grep "SSID\\|signal" `)
    const {stdout, stderr} = await  shellExec(`sudo -S iw dev wlan0 scan | grep "SSID\\|signal" `)
    if(stderr !== "") return stderr
    let results = stdout.split('\n')
    let data = chunkWifiNetworks(results,[])
    console.log(data)
    return data;
    //return shellExec("sudo ls -a")
}

function chunkWifiNetworks([first,second, ...others],networks=[]){    
    if(others.length){
        let [a,signal,b,sigValue] = first.split(/\:|\s/)||[undefined,undefined];
        let [ssid,ssidValue] = second.split(': ')||[undefined,undefined];

        networks = [...networks,{
            [signal]:[sigValue,toPercent(sigValue)],
            [ssid]:ssidValue
        }]
        return chunkWifiNetworks(others,networks)
    }else{
       return networks 
    }
    
}

function toPercent(x){
    if (x < -92)
        return 1
    if (x > -21)
        return 100

    return Math.round((-0.0154*x*x)-(0.3794*x)+98.182)
}
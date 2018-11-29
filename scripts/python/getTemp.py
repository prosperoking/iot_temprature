#!/usr/bin/python

import sys
import Adafruit_DHT
import json
import argparse
argsPaser = argparse.ArgumentParser(description="Get temprature and humidity reading")
argsPaser.add_argument('--c',type=int, nargs="?",default=None, help="Number of times to run")
args = argsPaser.parse_args()

counter = args.c or True

while counter:
    _humidity, _temp = Adafruit_DHT.read_retry(22,4,retries=1,delay_seconds=0.2)
    #_humidity, _temp = ["15.5f","70.54f"]

    if _humidity is not None and _temp is not None:
        print json.dumps({"humidity":_humidity,"temprature":_temp})
    else:
       print json.dumps({"status":False,"message":"unable to get any reading"})

    if(type(counter) == int):
            counter  -= 1           
    sys.stdout.flush()        

        
    

    

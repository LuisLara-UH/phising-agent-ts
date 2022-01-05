import { ONE_DAY_SECONDS, MAXIMUM_CALLERS_ALLOWED } from './constants'

class OwnedAddress {
    address: string;
    // Saves the last call timestamp received from every caller
    callersLastCallTime : { [key: string]: number };

    constructor(address: string){
        this.address = address
        this.callersLastCallTime = {}
    }

    getCallers(){ return Object.keys(this.callersLastCallTime) }

    receiveCall(callerAddress: string, timeStamp: number){
        this.callersLastCallTime[callerAddress] = timeStamp
        this.clearOldCalls(timeStamp)
    }

    // clear old calls(those with timestamp < 24 hours ago)
    clearOldCalls(timeStamp: number){
        for (let key in Object.keys(this.callersLastCallTime))
        {
            if(this.callersLastCallTime[key] < timeStamp - ONE_DAY_SECONDS)
            {
                delete this.callersLastCallTime[key]
            }
        }
    }

    possibleAttack(){
        return Object.keys(this.callersLastCallTime).length > MAXIMUM_CALLERS_ALLOWED
    }
}

export{
    OwnedAddress
}
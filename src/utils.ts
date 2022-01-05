import Web3 from "web3"
import { DEFAULT_CALLER_ADDRESS } from './constants'

let web3 = new Web3(Web3.givenProvider)

function isContractAddress(address: string): boolean {
    var addressCode: string = ''
    web3.eth.getCode(address).then(result => addressCode = result)
    
    return addressCode[0] == '0' && addressCode[1] == 'x'
}

function encodeFunction(name: string): string {
    return web3.eth.abi.encodeFunctionCall({
        name: 'approve',
        type: 'function',
        inputs: [ ]
    }, [])
}

// makes a default address with a sufix number
function makeAddress(sufixNumber: number): string {
    var sufix = "" + sufixNumber
    const sufixLength = sufix.length
    const prefixLength = DEFAULT_CALLER_ADDRESS.length - sufixLength
    const prefix = DEFAULT_CALLER_ADDRESS.substring(0, prefixLength)

    var address = prefix + sufix

    return address
}

export{
    isContractAddress,
    encodeFunction,
    makeAddress
}

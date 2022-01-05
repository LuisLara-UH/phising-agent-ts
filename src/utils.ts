const Web3 = require('web3');

function isContractAddress(address: string) {
    var addresCode = Web3.eth.getCode(address)
    
    return addresCode[0] == '0' && address[1] == 'x'
}

function encodeFunction(name: string) {
    return Web3.eth.abi.encodeFunctionSignature(name);
}

export{
    isContractAddress,
    encodeFunction
}

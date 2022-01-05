import BigNumber from 'bignumber.js'
import { 
  BlockEvent, 
  Finding, 
  HandleBlock, 
  HandleTransaction, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType
} from 'forta-agent'
import { OwnedAddress } from './ownedAddress'
import { ERC_20_APPROVE_FUNCTION, ERC_20_INCREASE_ALLOWANCE_FUNCTION } from './constants'
import { isContractAddress } from './utils'

let findingsCount = 0
let ownedAddresses: {[key: string]: OwnedAddress} = {}

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = []

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  var targetedAddress : string = txEvent.to ? txEvent.to : ""
  var callerAddress : string = txEvent.from ? txEvent.from : ""
  var timestamp : number = txEvent.timestamp

  
  // return empty if caller is a contract
  if(isContractAddress(callerAddress)) { return findings }

  // save targeted address
  if (!(targetedAddress in ownedAddresses)){
    ownedAddresses[targetedAddress] = new OwnedAddress(targetedAddress)
  }
  var address = ownedAddresses[targetedAddress]

  var approveInvocations = txEvent.filterFunction(ERC_20_APPROVE_FUNCTION)
  var increaseAllowanceInvocations = txEvent.filterFunction(ERC_20_INCREASE_ALLOWANCE_FUNCTION)

  // fire alerts if there is almost one approve or increaseAllowance call
  if(approveInvocations.length > 0 || increaseAllowanceInvocations.length > 0)
  {  
    address.receiveCall(callerAddress, timestamp)
    if(address.possibleAttack())
    {
      findings.push(Finding.fromObject({
        name: "Possible Phishing Attack",
        description: `Attackers accounts: `,
        alertId: "FORTA-1",
        severity: FindingSeverity.Info,
        type: FindingType.Suspicious
      }))
      findingsCount++
    }
  }
  return findings
}

export default {
  handleTransaction,
  // handleBlock
}
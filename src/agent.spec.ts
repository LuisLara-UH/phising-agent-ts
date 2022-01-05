import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from "forta-agent"
import agent from "./agent"
import { MAXIMUM_CALLERS_ALLOWED, DEFAULT_CALLER_ADDRESS, DEFAULT_TARGETED_ADDRESS } from './constants'
import { encodeFunction, makeAddress } from './utils'

describe("phishing attack agent", () => {
  let handleTransaction: HandleTransaction

  const createTxEventWithApprove = (callerAddress: string = DEFAULT_CALLER_ADDRESS, 
        targetedAddress: string = DEFAULT_TARGETED_ADDRESS, timestamp: number = 1) => createTransactionEvent({
    transaction: { from: callerAddress,
                to: targetedAddress} as any,
    traces: [{ 
        action: {
          to: targetedAddress,
          input:  encodeFunction("approve")
        } 
      } as any],
    receipt: {} as any,
    block: { timestamp: timestamp } as any,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe("handleTransaction", () => {
    it("returns empty findings if number of calls to approve is below threshold", async () => {
      const txEvent = createTxEventWithApprove()

      var findings: Finding[] = []
      await handleTransaction(txEvent).then(result => {findings = result})

      expect(findings).toStrictEqual([])
    })

    it("returns a finding if number of calls to approve is above threshold", async () => {
      var findings : Finding[] = [];

      var i = MAXIMUM_CALLERS_ALLOWED + 1
      while(--i)
      {
        const txEvent = createTxEventWithApprove(makeAddress(i))
        await handleTransaction(txEvent).then(result => { findings = findings.concat(result) })
      }

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Possible Phishing Attack",
          description: `Attackers accounts: `,
          alertId: "FORTA-1",
          severity: FindingSeverity.Info,
          type: FindingType.Suspicious
        }),
      ])
    })
  })
})

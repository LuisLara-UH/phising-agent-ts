import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from "forta-agent"
import agent from "./agent"
import { MAXIMUM_CALLERS_ALLOWED, DEFAULT_CALLER_ADDRESS, 
    DEFAULT_TARGETED_ADDRESS, DEFAULT_CALLER_ADDRESS_PREFIX } from './constants'
import { encodeFunction } from './utils'

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
    block: {} as any,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe("handleTransaction", () => {
    it("returns empty findings if number of calls to approve is below threshold", async () => {
      const txEvent = createTxEventWithApprove()

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it("returns a finding if number of calls to approve is above threshold", async () => {
      var findings : Finding[] = [];

      for(const i in Array(MAXIMUM_CALLERS_ALLOWED + 1).keys())
      {
        const txEvent = createTxEventWithApprove(DEFAULT_CALLER_ADDRESS_PREFIX + i)
        findings.concat(await handleTransaction(txEvent))
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

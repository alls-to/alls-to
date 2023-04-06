import { AllsToEvents } from 'lib/db'
import predefinedData from './predefined'
import { mintToken } from './contract'

const REWARD_AMOUNT = process.env.REWARD_AMOUNT

export async function queryAndSendReward (code, addr) {
  const validData = predefinedData.find(item => item.code === code)
  if (validData?.code) {
    const exist = await AllsToEvents.findOne({ code: validData?.code, addr })

    if (!exist) {
      const newRecord = await AllsToEvents.create({
        code: validData?.code,
        amount: REWARD_AMOUNT,
        mint_hash: '',
        addr
      })
      const txRes = await mintToken(addr, REWARD_AMOUNT)
      if (txRes.hash) {
        return await AllsToEvents.findOneAndUpdate({ _id: newRecord._id }, { mint_hash: txRes.hash }, { new: true})
      }
      return newRecord
    }
  }
}

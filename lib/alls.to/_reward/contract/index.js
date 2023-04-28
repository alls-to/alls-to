import { ethers } from 'ethers'
import abi from './vALSToken.json'

const {
  VALS_TOKEN_ADDRESS,
  SIGNER_PRIVATE_KEY,
  RPC_NODE_URL
} = process.env

const provider = new ethers.providers.JsonRpcProvider(RPC_NODE_URL)
const contractAddr = VALS_TOKEN_ADDRESS
const privateKey = SIGNER_PRIVATE_KEY
let signer
let contract

export const mintToken = async function (address, amount) {
  if (!privateKey) {
    return {
      hash: ''
    }
  }

  if (!signer) {
    signer = new ethers.Wallet(privateKey, provider)
  }

  if (!contract) {
    contract = new ethers.Contract(contractAddr, abi, signer)
  }

  try {
    return await contract.mint(address.toLowerCase(), amount)
  } catch (e) {
    console.warn(address, e)
    return {
      hash: ''
    }
  }
}

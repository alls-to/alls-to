import { verify } from '@mesonfi/web3-jwt'

const { NEXT_PUBLIC_SIGNING_MESSAGE } = process.env

export default function verifyJwt (authorization) {
  if (!authorization) {
    return
  }

  const [key, token] = authorization.split(' ')
  if (key !== 'Bearer') {
    return
  }

  try {
    return verify(token, NEXT_PUBLIC_SIGNING_MESSAGE, { verifier: process.env.NEXT_PUBLIC_PARTICLE_VERIFIER_ADDR })
  } catch (e) {
    return
  }
}

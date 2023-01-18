import verifyJwt from 'lib/verifyJwt'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const REGION = process.env.NEXT_PUBLIC_AWS_REGION
const BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  signatureVersion: 'v4'
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const encoded = verifyJwt(req.headers.authorization)
    if (!encoded) {
      res.status(401).end()
      return
    }

    const { key } = req.body
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key
    })
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    })

    res.json({
      result: signedUrl
    })

  } else {
    res.status(401).end()
  }
}

import express from 'express'
import crypto from 'crypto'
import { GITHUB_WEBHOOK_SECRET } from '../../config'

export const verifySignature = (
  req: express.Request,
  res: express.Response,
  buf: Buffer
) => {
  const signature = req.headers["x-hub-signature-256"] as string;

  if (!signature || !signature.startsWith("sha256=")) {
    return res.status(401).send("Invalid signature");
  }

  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET).update(buf).digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return res.status(401).send("Signature verification failed");
  }
};
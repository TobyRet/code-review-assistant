import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import crypto from "crypto"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";

app.use(bodyParser.json());

const verifySignature = (req: express.Request, res: express.Response, buf: Buffer) => {
  const signature = req.headers["x-hub-signature-256"] as string;

  if (!signature || !signature.startsWith("sha256=")) {
    return res.status(401).send("Invalid signature");
  }

  const expectedSignature = "sha256=" + crypto
    .createHmac("sha256", GITHUB_WEBHOOK_SECRET)
    .update(buf)
    .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).send("Signature verification failed");
  }
};

app.use(
  bodyParser.json({
    verify: verifySignature,
  })
);

app.post("/webhook", (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  if (event === "pull_request") {
    const { action, pull_request, repository } = payload;

    console.log(`Received PR event: ${action}`);
    console.log(`Repo: ${repository.full_name}`);
    console.log(`PR Title: ${pull_request.title}`);
    console.log(`Author: ${pull_request.user.login}`);
    console.log(`PR URL: ${pull_request.html_url}`);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook handler running on http://localhost:${PORT}`);
});


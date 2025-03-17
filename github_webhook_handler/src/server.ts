import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";

import { handleWebhook } from './controllers/webHookController'
import { verifySignature } from './services/github/verifySignature'

const app = express();

app.use(
  bodyParser.json({
    verify: verifySignature,
  })
);

app.post("/webhook", handleWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook handler running on http://localhost:${PORT}`);
});


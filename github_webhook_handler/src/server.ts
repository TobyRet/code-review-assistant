import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  console.log("🔹 Received Webhook:", JSON.stringify(req.body, null, 2));
  res.status(200).send("Webhook received!");
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook handler running on http://localhost:${PORT}`);
});


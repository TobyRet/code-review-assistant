import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto"
import axios from "axios";
import { fetchFileContent } from './services/github'
import { GITHUB_API_URL, GITHUB_TOKEN, GITHUB_WEBHOOK_SECRET } from './config'


const app = express();
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

app.post("/webhook", async (req: express.Request, res: express.Response) => {
  const event = req.headers["x-github-event"];

  if (event !== "pull_request") {
    res.status(200).send("Ignored");
    return;
  }

  const payload = req.body;
  const prNumber = payload.pull_request.number;
  const repoFullName = payload.repository.full_name;
  const prTitle = payload.pull_request.title;
  const prUrl = payload.pull_request.html_url;

  console.log(`PR #${prNumber} - "${prTitle}"`);
  console.log(`Fetching changed files...`);

  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${repoFullName}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const changedFiles = response.data.map((file: any) => file.filename);
    console.log(`Changed files:`, changedFiles);

    for (const filePath of changedFiles) {
      const fileContent = await fetchFileContent(repoFullName, filePath, payload.pull_request.head.sha);
      console.log(`Content for file ${filePath}:`, fileContent);
    }

    res.status(200).send("Files fetched");
  } catch (error) {
    console.error("Error fetching PR files:", error);
    res.status(500).send("Error fetching PR files");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook handler running on http://localhost:${PORT}`);
});


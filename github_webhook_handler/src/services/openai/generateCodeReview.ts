import { OpenAI } from "openai";
import { OPENAI_API_KEY } from '../../config'
import { GenerateCodeReviewParams } from './types'
import { postReviewComment } from '../github/postReviewComment'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const generateCodeReview = async (
  { repoFullName, prNumber, fileName, fileContent, latestCommitSha }: GenerateCodeReviewParams
): Promise<void> => {
  try {
    const prompt = `Review the following code file and provide constructive feedback with best practices.
    
    **File:** ${fileName}
    
    ${fileContent}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo" as OpenAI.Chat.ChatModel,
      messages: [{ role: "system", content: "You are a helpful code reviewer that follows best practices." },
        { role: "user", content: prompt }],
      max_tokens: 500,
    });

    const reviewFeedback = response.choices[0].message.content || "No feedback generated.";
    await postReviewComment({repoFullName, prNumber, comment: reviewFeedback, filePath: fileName, latestCommitSha,});
  } catch (error) {
    console.error("Error generating code review:", error);
    await postReviewComment({ repoFullName, prNumber, comment: "⚠️ Error: Unable to generate code review.", filePath: fileName, latestCommitSha });
  }
};



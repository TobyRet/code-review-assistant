import { OpenAI } from "openai";
import { OPENAI_API_KEY } from '../../config'
import { GenerateCodeReviewParams } from './types'
import { postReviewComment } from '../github/postReviewComment'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const generateCodeReview = async (params: GenerateCodeReviewParams): Promise<void> => {
  const { repoFullName, prNumber, fileName, fileContent } = params
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

    const reviewFeedback = `**Review for file: ${fileName}**\\n\\n${response.choices[0].message.content}` || "No feedback generated.";
    await postReviewComment(repoFullName, prNumber, reviewFeedback);
  } catch (error) {
    console.error("Error generating code review:", error);
    await postReviewComment(repoFullName, prNumber, "⚠️ Error: Unable to generate code review.");
  }
};



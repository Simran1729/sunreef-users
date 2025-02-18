import { TicketFormData } from "@shared/schema";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to transcribe audio");
  }

  return response.json();
}

export async function extractTicketData(text: string): Promise<TicketFormData> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Extract ticket information from the following text. Provide response as JSON with the following fields: projectName, projectCode, departmentName, teamName, severity, description, subject"
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to extract ticket data");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

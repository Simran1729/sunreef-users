import { TicketFormData } from "@shared/schema";
import { getDepartmentByName } from "./departments";

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
          content: `Extract ticket information from the text and generate a concise subject line. Follow these rules:
1. Extract: projectName, projectCode, departmentName, teamName, severity, description
2. Generate a concise subject line that summarizes the description
3. Ensure departmentName matches one of: Planning Department, Production Department, Service Department, Engineering Department
4. Ensure teamName matches a team from the selected department
Response must be JSON with fields: projectName, projectCode, departmentName, teamName, severity, description, subject`
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
  const extractedData = JSON.parse(data.choices[0].message.content);

  // Get department ID
  const department = getDepartmentByName(extractedData.departmentName);
  if (!department) {
    throw new Error(`Invalid department: ${extractedData.departmentName}`);
  }

  // Validate team belongs to department
  if (!department.teams.includes(extractedData.teamName)) {
    extractedData.teamName = department.teams[0]; // Default to first team
  }

  return {
    ...extractedData,
    departmentName: department.id, // Replace name with ID
  };
}
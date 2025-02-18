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
          content: `Extract ticket information from the text and generate a concise subject line. Follow these rules carefully:

1. Extract ALL of these fields from the input:
   - projectName: The name of the project
   - projectCode: The project's code identifier
   - departmentName: Must be one of: Planning Department, Production Department, Service Department, Engineering Department
   - teamName: Must be a valid team for the mentioned department:
     * Planning Department: Planning Team
     * Production Department: Production Team 1, Production Team 2, Production Team 3
     * Service Department: Service Team
     * Engineering Department: ALUSS, Composite, Interior Engineering, Yacht Design, Interior Design, Yacht Design 3D Visuals, Deck outfitting, Electrical, Integrated Solutions, Machinery and Piping
   - severity: Must be one of: Low, Medium, High, Critical
   - description: The detailed description of the issue

2. Generate a concise subject line that summarizes the description

3. If any field is not explicitly mentioned in the input:
   - For teamName: Leave as empty string
   - For severity: Leave as empty string
   - For other fields: Extract best guess from context

Response must be a JSON object with these exact fields: projectName, projectCode, departmentName, teamName, severity, description, subject`
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
  if (extractedData.teamName && !department.teams.includes(extractedData.teamName)) {
    extractedData.teamName = ""; // Clear invalid team
  }

  return {
    ...extractedData,
    departmentName: department.id, // Replace name with ID
  };
}
import { TicketFormData } from "@shared/schema";
import { getDepartmentByName } from "./departments";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
console.log("thsi is api key: ", OPENAI_API_KEY);

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

  console.log("this is response from openai: ", response);

  if (!response.ok) {
    throw new Error("Failed to transcribe audio");
  }

  return response.json();
}



export async function translateAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/translations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  console.log("this is response from openai translation: ", response);

  if (!response.ok) {
    throw new Error("Failed to translate audio");
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
            - projectCode: The project's code identifier (The project Codes are mostly like this : 80P33, 60A58, 70A27, 70P15, 60P13E, 60A54, 80A49, 80A48, SV8723 etc.)
            - departmentName: Must be one of: Planning Department, Production Department, Service Department, Engineering Department
            - teamName: Must be a valid team for the mentioned department:
              * Planning Department: Planning Team
              * Production Department: Production Team 1, Production Team 2, Production Team 3
              * Service Department: Service Team
              * Engineering Department: Naval Architecture and Hydrodynamics, Structural Engineering, Mechanical Propulsion and Systems Engineering, Electrical and Electrical Power Systems, Interior Design and Fitout Engineering, Outfitting and Deck Systems, 3D CAD / Master Modelling Cell
            - severity: Must be one of: Minor, Major, Critical, Show Stopper
            - description: The description of the issue as described in the input text. Please don't chip away any details as in the given text keep the details as it is.
            - priority: Must be one of : Low, Medium, High, Critical

          2.Ensure that the selected **team corresponds to the department**. If a mismatch is found, correct it based on the best available match.
          3. Generate a concise subject line that summarizes the description

          4.Determine severity based on user input and yacht manufacturing context:**
            - If the user explicitly mentions severity with these values : Minor or Major or Critical or Show Stopper, use that value.
            - If severity is **not explicitly mentioned**, infer it **based on the urgency, impact, and criticality of the issue.
            - **Severity classification for yacht manufacturing:**
              * **Minor:** Minor inconvenience, documentation updates, small cosmetic issues (e.g., minor scratches, small alignment issues).
              * **Major:** Work is partially blocked, but operations can continue with adjustments (e.g., delayed material deliveries, minor electrical issues, software glitches in yacht management systems).
              * **Critical:** Major disruption, affecting production timelines or critical yacht components (e.g., hydraulic system malfunctions, navigation system bugs, delays in core manufacturing processes).
              * **Show Stopper:** Severe issues causing production shutdown, safety risks, or operational failures (e.g., structural integrity issues, engine failures, major leaks, loss of communication systems).
          
          5.Determine priority based on user input:
          - If the user explicity mentions priority with these values : Low or Medium or High or Critical, use that value.
          - If not mentioned explicitly infer it based on the urgency and impact of the provided issue.

          Response must be a JSON object with these exact fields(make sure all fields are in response with values): projectCode, departmentName, teamName, severity, description, subject, priority`
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
  console.log("This is the extracted data form the audio : ", extractedData);

  // Get department ID
  const department = getDepartmentByName(extractedData.departmentName);
  if (!department) {
    throw new Error(`Invalid department: ${extractedData.departmentName}`);
  }
  return {
    ...extractedData,
    departmentName: department.id, // Replace name with ID
  };
}
import { createContext, useContext, useState, ReactNode } from "react";
import { TicketFormData } from "@shared/schema";

interface VoiceContextType {
  selectedUser: string | null;
  setSelectedUser: (user: string | null) => void;
  selectedEmail: string | null;
  setSelectedEmail: (email: string | null) => void;
  transcription: string | null;
  setTranscription: (text: string | null) => void;
  extractedData: TicketFormData | null;
  setExtractedData: (data: TicketFormData | null) => void;
  step: number;
  setStep: (step: number) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  ticketId: string;
  setTicketId: (id: string) => void;
  resetJourney: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<TicketFormData | null>(null);
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const resetJourney = () => {
    setStep(1);
    setSelectedUser(null);
    setSelectedEmail(null);
    setExtractedData(null);
    setTranscription(null);
    setTicketId("");
  };

  return (
    <VoiceContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        selectedEmail,
        setSelectedEmail,
        transcription,
        setTranscription,
        extractedData,
        setExtractedData,
        step,
        setStep,
        isRecording,
        setIsRecording,
        ticketId,
        setTicketId,
        resetJourney,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}
import { useVoice } from "@/context/VoiceContext";
import UserSelect from "@/components/UserSelect";
import VoiceRecorder from "@/components/VoiceRecorder";
import TicketForm from "@/components/TicketForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import TicketConfirmation from "@/components/TicketConfirmation";

export default function Home() {
  const { step, setStep,ticketId, resetJourney } = useVoice();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          {step > 1 && (
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {/* <h1 className="text-4xl font-bold tracking-tight">
            Voice Ticket Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create support tickets using voice commands
          </p> */}
           {step !== 1 && (
            <>
              <h1 className="text-4xl font-bold tracking-tight">
                Voice Ticket Generator
              </h1>
              <p className="text-muted-foreground mt-2">
                Create support tickets using voice commands
              </p>
            </>
          )}
        </div>

        {step === 1 && <UserSelect />}
        {step === 2 && <VoiceRecorder />}
        {step === 3 && <TicketForm />}
        {step === 4 && <TicketConfirmation ticketId={ticketId} resetJourney={resetJourney} />}
      </div>
    </div>
  );
}

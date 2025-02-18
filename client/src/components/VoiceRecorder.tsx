import { useState, useRef } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AudioVisualizer from "./AudioVisualizer";
import { transcribeAudio, extractTicketData } from "@/lib/openai";

export default function VoiceRecorder() {
  const { setTranscription, setExtractedData, setStep, isRecording, setIsRecording } = useVoice();
  const { toast } = useToast();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        try {
          const { text } = await transcribeAudio(audioBlob);
          setTranscription(text);
          const extractedData = await extractTicketData(text);
          setExtractedData(extractedData);
          setStep(3);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to process audio. Please try again.",
            variant: "destructive",
          });
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Record Voice</h2>
          <p className="text-muted-foreground">
            Speak clearly to describe your ticket details
          </p>
          
          <div className="flex flex-col items-center gap-4">
            {isRecording && <AudioVisualizer />}
            
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isRecording ? (
                <>
                  <StopCircle className="mr-2" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2" /> Start Recording
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useRef, useEffect } from "react";
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
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup function to stop media stream when component unmounts
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        } 
      });

      mediaStreamRef.current = stream;
      chunksRef.current = [];

      // Create MediaRecorder with audio settings optimized for Whisper
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        try {
          toast({
            title: "Processing",
            description: "Transcribing audio...",
          });

          const { text } = await transcribeAudio(audioBlob);
          setTranscription(text);

          toast({
            title: "Processing",
            description: "Extracting ticket information...",
          });

          const extractedData = await extractTicketData(text);
          setExtractedData(extractedData);
          setStep(3);

          toast({
            title: "Success",
            description: "Voice recording processed successfully!",
          });
        } catch (error) {
          console.error('Processing error:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process audio. Please try again.",
            variant: "destructive",
          });
        }
      };

      mediaRecorder.current.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);

      // Stop all tracks in the stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Record Voice</h2>
          <p className="text-muted-foreground">
            Speak clearly to describe your ticket details. Include project name, code, department, team, severity, and description.
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
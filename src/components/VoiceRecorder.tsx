// // import { useState, useRef, useEffect } from "react";
// // import { useVoice } from "@/context/VoiceContext";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Mic, StopCircle, ArrowRight } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";
// // import AudioVisualizer from "./AudioVisualizer";
// // import { transcribeAudio, extractTicketData } from "@/lib/openai";

// // export default function VoiceRecorder() {
// //   const { 
// //     transcription, 
// //     setTranscription, 
// //     setExtractedData, 
// //     setStep, 
// //     isRecording, 
// //     setIsRecording 
// //   } = useVoice();
  
// //   const { toast } = useToast();
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const mediaRecorder = useRef<MediaRecorder | null>(null);
// //   const chunksRef = useRef<Blob[]>([]);
// //   const mediaStreamRef = useRef<MediaStream | null>(null);
// //   const audioBlobRef = useRef<Blob | null>(null);

// //   useEffect(() => {
// //     // Cleanup function to stop media stream when component unmounts
// //     return () => {
// //       if (mediaStreamRef.current) {
// //         mediaStreamRef.current.getTracks().forEach(track => track.stop());
// //       }
// //     };
// //   }, []);

// //   const startRecording = async () => {
// //     try {
// //       // Reset transcription when starting a new recording
// //       setTranscription(null);
      
// //       // Request microphone access
// //       const stream = await navigator.mediaDevices.getUserMedia({ 
// //         audio: {
// //           channelCount: 1,
// //           sampleRate: 16000,
// //         } 
// //       });

// //       mediaStreamRef.current = stream;
// //       chunksRef.current = [];

// //       // Create MediaRecorder with audio settings optimized for Whisper
// //       mediaRecorder.current = new MediaRecorder(stream, {
// //         mimeType: 'audio/mp4',
// //       });

// //       mediaRecorder.current.ondataavailable = (e) => {
// //         if (e.data.size > 0) {
// //           chunksRef.current.push(e.data);
// //         }
// //       };

// //       mediaRecorder.current.onstop = async () => {
// //         const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp4' });
// //         audioBlobRef.current = audioBlob;

// //         try {
// //           toast({
// //             title: "Processing",
// //             description: "Transcribing audio...",
// //           });

// //           const { text } = await transcribeAudio(audioBlob);
// //           setTranscription(text);

// //           toast({
// //             title: "Success",
// //             description: "Audio transcribed successfully! Please review and continue.",
// //           });
// //         } catch (error) {
// //           console.error('Transcription error:', error);
// //           toast({
// //             title: "Error",
// //             description: error instanceof Error ? error.message : "Failed to transcribe audio. Please try again.",
// //             variant: "destructive",
// //           });
// //         }
// //       };

// //       mediaRecorder.current.start(100); // Collect data every 100ms
// //       setIsRecording(true);
// //     } catch (error) {
// //       console.error('Recording error:', error);
// //       toast({
// //         title: "Error",
// //         description: "Could not access microphone. Please check permissions and try again.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const stopRecording = () => {
// //     if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
// //       mediaRecorder.current.stop();
// //       setIsRecording(false);

// //       // Stop all tracks in the stream
// //       if (mediaStreamRef.current) {
// //         mediaStreamRef.current.getTracks().forEach(track => track.stop());
// //         mediaStreamRef.current = null;
// //       }
// //     }
// //   };

// //   const handleContinue = async () => {
// //     if (!transcription) return;
    
// //     setIsProcessing(true);
// //     try {
// //       toast({
// //         title: "Processing",
// //         description: "Extracting ticket information...",
// //       });

// //       const extractedData = await extractTicketData(transcription);
// //       setExtractedData(extractedData);
// //       setStep(3);

// //       toast({
// //         title: "Success",
// //         description: "Voice recording processed successfully!",
// //       });
// //     } catch (error) {
// //       console.error('Data extraction error:', error);
// //       toast({
// //         title: "Error",
// //         description: error instanceof Error ? error.message : "Failed to extract data. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   return (
// //     <Card>
// //       <CardContent className="pt-6">
// //         <div className="space-y-6">
// //           <h2 className="text-lg font-semibold">Record Voice</h2>
// //           <p className="text-muted-foreground">
// //             Please, speak clearly to describe your ticket details. Include 
// //             <ul className="list-disc list-inside text-muted-foreground pt-2">
// //             <li>Project Code</li>
// //             <li>Department</li>
// //             <li>Team</li>
// //             <li>Severity of the issue</li>
// //             {/* <li>Priority</li> */}
// //             <li>Description</li>
// //             </ul>
// //           </p>

// //           {transcription && (
// //             <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
// //               <h3 className="text-sm font-medium mb-2">Transcription Preview:</h3>
// //               <p className = "text-sm font-medium mb-2">You can edit the extracted information in the form</p>
// //               <p className="text-sm text-gray-700">{transcription}</p>
// //             </div>
// //           )}

// //           <div className="flex flex-col items-center gap-4">
// //             {isRecording && <AudioVisualizer />}

// //             <div className="flex flex-wrap items-center justify-center gap-4">
// //               <Button
// //                 size="lg"
// //                 onClick={isRecording ? stopRecording : startRecording}
// //                 className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
// //                 disabled={isProcessing}
// //               >
// //                 {isRecording ? (
// //                   <>
// //                     <StopCircle className="mr-2" /> Stop Recording
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Mic className="mr-2" /> Start Recording
// //                   </>
// //                 )}
// //               </Button>

// //               {transcription && !isRecording && (
// //                 <Button
// //                   size="lg"
// //                   onClick={handleContinue}
// //                   disabled={isProcessing}
// //                   className="bg-gray-900 hover:bg-gray-800"
// //                 >
// //                   Continue <ArrowRight className="ml-2" size={18} />
// //                 </Button>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }


// import { useState, useRef, useEffect } from "react";
// import { useVoice } from "@/context/VoiceContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Mic, StopCircle, ArrowRight } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import AudioVisualizer from "./AudioVisualizer";
// import { transcribeAudio, extractTicketData } from "@/lib/openai";

// export default function VoiceRecorder() {
//   const {
//     transcription,
//     setTranscription,
//     setExtractedData,
//     setStep,
//     isRecording,
//     setIsRecording,
//   } = useVoice();

//   const { toast } = useToast();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [hasRecordedOnce, setHasRecordedOnce] = useState(false);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);
//   const mediaStreamRef = useRef<MediaStream | null>(null);
//   const audioBlobRef = useRef<Blob | null>(null);

//   useEffect(() => {
//     return () => {
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       if (!hasRecordedOnce && transcription) setHasRecordedOnce(true);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           channelCount: 1,
//           sampleRate: 16000,
//         },
//       });

//       if (!stream || stream.getAudioTracks().length === 0) {
//         toast({
//           title: "No Microphone Detected",
//           description: "No microphone device found. Please connect a microphone and try again.",
//           variant: "destructive",
//         });
//         return;
//       }

//       mediaStreamRef.current = stream;
//       chunksRef.current = [];

//       mediaRecorder.current = new MediaRecorder(stream, {
//         mimeType: "audio/mp4",
//       });

//       mediaRecorder.current.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunksRef.current.push(e.data);
//         }
//       };

//       mediaRecorder.current.onstop = async () => {
//         const audioBlob = new Blob(chunksRef.current, { type: "audio/mp4" });
//         audioBlobRef.current = audioBlob;

//         try {
//           setIsTranscribing(true);
//           toast({
//             title: "Processing",
//             description: "Transcribing audio...",
//           });

//           const { text } = await transcribeAudio(audioBlob);
//           setTranscription(text);
//           setHasRecordedOnce(true);

//           toast({
//             title: "Success",
//             description: "Audio transcribed successfully! Please review.",
//           });
//         } catch (error) {
//           console.error("Transcription error:", error);
//           toast({
//             title: "Error",
//             description:
//               error instanceof Error
//                 ? error.message
//                 : "Failed to transcribe audio. Please try again.",
//             variant: "destructive",
//           });
//         } finally {
//           setIsTranscribing(false);
//         }
//       };

//       mediaRecorder.current.start(100);
//       setIsRecording(true);
//     }  catch (error) {
//       console.error("Recording error:", error);
//       if (error instanceof DOMException && error.name === "NotFoundError") {
//         toast({
//           title: "No Microphone Found",
//           description: "No microphone device detected. Please connect a microphone and try again.",
//           variant: "destructive",
//         });
//       } else if (error instanceof DOMException && error.name === "NotAllowedError") {
//         toast({
//           title: "Permission Denied",
//           description: "Microphone access was denied. Please allow microphone permissions in your browser settings.",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description:
//             "Could not access microphone. Please check permissions and try again.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
//       mediaRecorder.current.stop();
//       setIsRecording(false);

//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//         mediaStreamRef.current = null;
//       }
//     }
//   };

//   const handleContinue = async () => {
//     if (!transcription) return;

//     setIsProcessing(true);
//     try {
//       toast({
//         title: "Processing",
//         description: "Extracting ticket information...",
//       });

//       const extractedData = await extractTicketData(transcription);
//       setExtractedData(extractedData);
//       setStep(3);

//       toast({
//         title: "Success",
//         description: "Voice recording processed successfully!",
//       });
//     } catch (error) {
//       console.error("Data extraction error:", error);
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error
//             ? error.message
//             : "Failed to extract data. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <div className="space-y-6">
//           <h2 className="text-lg font-semibold">Record Voice</h2>
//           <div className="text-muted-foreground">
//             Speak clearly to describe your ticket details, including:
//             <ul className="list-disc list-inside text-muted-foreground pt-2">
//               <li>Project Code</li>
//               <li>Department</li>
//               <li>Team</li>
//               <li>Severity of the issue</li>
//               <li>Priority</li>
//               <li>Description</li>
//             </ul>
//           </div>

//           {transcription && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
//               <h3 className="text-sm font-medium mb-2">Transcription Preview:</h3>
//               <p className="text-sm font-medium mb-2">
//                 You can edit the extracted information in the form.
//               </p>
//               <p className="text-sm text-gray-700">{transcription}</p>
//             </div>
//           )}

//           <div className="flex flex-col items-center gap-4">
//             {isRecording && <AudioVisualizer />}

//             <div className="flex flex-wrap items-center justify-center gap-4">
//               <Button
//                 size="lg"
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
//                 disabled={isProcessing || isTranscribing}
//               >
//                 {isRecording ? (
//                   <>
//                     <StopCircle className="mr-2" /> Stop Recording
//                   </>
//                 ) : (
//                   <>
//                     <Mic className="mr-2" />
//                     {hasRecordedOnce || transcription ? "Re-Record" : "Start Recording"}
//                   </>
//                 )}
//               </Button>

//               {transcription && !isRecording && (
//                 <Button
//                   size="lg"
//                   onClick={handleContinue}
//                   disabled={isProcessing}
//                   className="bg-gray-900 hover:bg-gray-800"
//                 >
//                   Continue <ArrowRight className="ml-2" size={18} />
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }








import { useState, useRef, useEffect } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AudioVisualizer from "./AudioVisualizer";
import { transcribeAudio, translateAudio, extractTicketData } from "@/lib/openai";

type Language = "english" | "polish";

export default function VoiceRecorder() {
  const {
    transcription,
    setTranscription,
    setExtractedData,
    setStep,
    isRecording,
    setIsRecording,
  } = useVoice();

  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (!selectedLanguage) {
      toast({
        title: "Language Required",
        description: "Please select a language before recording.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!hasRecordedOnce && transcription) setHasRecordedOnce(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      if (!stream || stream.getAudioTracks().length === 0) {
        toast({
          title: "No Microphone Detected",
          description: "No microphone device found. Please connect a microphone and try again.",
          variant: "destructive",
        });
        return;
      }

      mediaStreamRef.current = stream;
      chunksRef.current = [];

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "audio/mp4",
      });

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/mp4" });
        audioBlobRef.current = audioBlob;

        try {
          setIsTranscribing(true);
          toast({
            title: "Processing",
            description: selectedLanguage === "english" ? "Transcribing audio..." : "Translating audio...",
          });

          let result;
          if (selectedLanguage === "english") {
            result = await transcribeAudio(audioBlob);
          } else {
            result = await translateAudio(audioBlob);
          }
          
          setTranscription(result.text);
          setHasRecordedOnce(true);

          toast({
            title: "Success",
            description: selectedLanguage === "english" 
              ? "Audio transcribed successfully! Please review." 
              : "Audio translated successfully! Please review.",
          });
        } catch (error) {
          console.error("Processing error:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : `Failed to ${selectedLanguage === "english" ? "transcribe" : "translate"} audio. Please try again.`,
            variant: "destructive",
          });
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.current.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      if (error instanceof DOMException && error.name === "NotFoundError") {
        toast({
          title: "No Microphone Found",
          description: "No microphone device detected. Please connect a microphone and try again.",
          variant: "destructive",
        });
      } else if (error instanceof DOMException && error.name === "NotAllowedError") {
        toast({
          title: "Permission Denied",
          description: "Microphone access was denied. Please allow microphone permissions in your browser settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            "Could not access microphone. Please check permissions and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  const handleContinue = async () => {
    if (!transcription) return;

    setIsProcessing(true);
    try {
      toast({
        title: "Processing",
        description: "Extracting ticket information...",
      });

      const extractedData = await extractTicketData(transcription);
      setExtractedData(extractedData);
      setStep(3);

      toast({
        title: "Success",
        description: "Voice recording processed successfully!",
      });
    } catch (error) {
      console.error("Data extraction error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to extract data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Record Voice</h2>
          
          {/* Language Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Select Language:</h3>
            <div className="flex gap-3">
              <Button
                variant={selectedLanguage === "english" ? "default" : "outline"}
                onClick={() => setSelectedLanguage("english")}
                disabled={isRecording || isTranscribing}
                className="flex-1"
              >
                English
              </Button>
              <Button
                variant={selectedLanguage === "polish" ? "default" : "outline"}
                onClick={() => setSelectedLanguage("polish")}
                disabled={isRecording || isTranscribing}
                className="flex-1"
              >
                Polish
              </Button>
            </div>
          </div>

          <div className="text-muted-foreground">
            Speak clearly to describe your ticket details, including:
            <ul className="list-disc list-inside text-muted-foreground pt-2">
              <li>Project Code</li>
              <li>Department</li>
              <li>Team</li>
              <li>Severity of the issue</li>
              <li>Priority</li>
              <li>Description</li>
            </ul>
          </div>

          {transcription && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium mb-2">
                {selectedLanguage === "english" ? "Transcription" : "Translation"} Preview:
              </h3>
              <p className="text-sm font-medium mb-2">
                You can edit the extracted information in the form.
              </p>
              <p className="text-sm text-gray-700">{transcription}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            {isRecording && <AudioVisualizer />}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
                disabled={isProcessing || isTranscribing || !selectedLanguage}
              >
                {isRecording ? (
                  <>
                    <StopCircle className="mr-2" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2" />
                    {hasRecordedOnce || transcription ? "Re-Record" : "Start Recording"}
                  </>
                )}
              </Button>

              {transcription && !isRecording && (
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={isProcessing}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  Continue <ArrowRight className="ml-2" size={18} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
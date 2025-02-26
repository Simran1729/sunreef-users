import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// interface TicketConfirmationProps {
//   ticketId: string;
//   resetJourney: () => void;
// }

// export default function TicketConfirmation({ ticketId, resetJourney }: TicketConfirmationProps) {
//   const { toast } = useToast();
//   const [copying, setCopying] = useState(false);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(ticketId);
//     setCopying(true);
    
//     toast({
//       title: "Copied to clipboard",
//       description: `Ticket ID ${ticketId} copied to clipboard`,
//       variant: "success",
//       duration: 2000,
//     });
    
//     setTimeout(() => setCopying(false), 1500);
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
//         <div className="flex items-center gap-2">
//           <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
//           <CardTitle className="text-xl">Ticket Created Successfully</CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="space-y-6">
//           <div className="text-center">
//             <p className="text-muted-foreground mb-3">Your ticket has been generated with ID:</p>
//             <div className="flex items-center justify-center gap-2 mb-6">
//               <div className="bg-muted/50 px-4 py-3 rounded-md font-mono text-xl">
//                 {ticketId}
//               </div>
//               <Button 
//                 variant="outline" 
//                 size="icon" 
//                 onClick={copyToClipboard}
//                 className="h-10 w-10"
//               >
//                 {copying ? 
//                   <CheckCircle className="h-4 w-4 text-green-600" /> : 
//                   <Copy className="h-4 w-4" />
//                 }
//               </Button>
//             </div>
//           </div>
          
//           <div className="bg-muted/30 p-4 rounded-lg">
//             <h3 className="font-medium mb-2">What happens next?</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li className="flex items-start gap-2">
//                 <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
//                 <span>Our team will review your ticket and assign it to the appropriate department.</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
//                 <span>You'll receive updates via email as your ticket progresses.</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <div className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
//                 <span>You can reference this ticket ID in any communications about this issue.</span>
//               </li>
//             </ul>
//           </div>
          
//           <div className="flex justify-center pt-4">
//             <Button 
//               onClick={resetJourney} 
//               className="w-full sm:w-auto"
//               size="lg"
//             >
//               <Home className="mr-2 h-4 w-4" />
//               Return to Home
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

interface TicketConfirmationProps {
  ticketId: string;
  resetJourney: () => void;
}

export default function TicketConfirmation({ ticketId, resetJourney }: TicketConfirmationProps) {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketId);
    setCopying(true);
    
    toast({
      title: "Copied to clipboard",
      description: `Ticket ID ${ticketId} copied to clipboard`,
      variant: "success",
      duration: 2000,
    });
    
    setTimeout(() => setCopying(false), 1500);
  };

  return (
    // <Card className="w-full max-w-lg mx-auto">
    //   <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
    //     <div className="flex items-center gap-2 justify-center">
    //       <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
    //       <CardTitle className="text-xl">Ticket Created Successfully</CardTitle>
    //     </div>
    //   </CardHeader>
    //   <CardContent className="pt-6">
    //     <div className="space-y-6 text-center">
    //       <p className="text-muted-foreground mb-3">Your ticket has been generated with ID:</p>
          
    //       <div className="flex flex-col items-center gap-4 mb-6">
    //         <div className="bg-muted/50 px-6 py-4 rounded-md font-mono text-2xl text-black dark:text-white">
    //           {ticketId}
    //         </div>
    //         <Button 
    //           variant="outline" 
    //           size="icon" 
    //           onClick={copyToClipboard}
    //           className="h-12 w-12"
    //         >
    //           {copying ? 
    //             <CheckCircle className="h-6 w-6 text-green-600" /> : 
    //             <Copy className="h-6 w-6" />
    //           }
    //         </Button>
    //       </div>
          
    //       <div className="flex justify-center pt-4">
    //         <Button 
    //           onClick={resetJourney} 
    //           className="w-full sm:w-auto"
    //           size="lg"
    //         >
    //           <Home className="mr-2 h-4 w-4" />
    //           Return to Home
    //         </Button>
    //       </div>
    //     </div>
    //   </CardContent>
    // </Card>
        <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
            <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <CardTitle className="text-xl sm:text-2xl">Ticket Created Successfully</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="space-y-6 text-center">
            <p className="text-muted-foreground mb-3 text-sm sm:text-base">Your ticket has been generated with ID:</p>
            
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="bg-muted/50 px-6 py-4 rounded-md font-mono text-xl sm:text-2xl text-black dark:text-white">
                {ticketId}
                </div>
                <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                className="h-12 w-12"
                >
                {copying ? 
                    <CheckCircle className="h-6 w-6 text-green-600" /> : 
                    <Copy className="h-6 w-6" />
                }
                </Button>
            </div>
            
            <div className="flex justify-center pt-4">
                <Button 
                onClick={resetJourney} 
                className="w-full sm:w-auto"
                size="lg"
                >
                <Home className="mr-2 h-4 w-4" />
                Return to Home
                </Button>
            </div>
            </div>
        </CardContent>
    </Card>

  );
}

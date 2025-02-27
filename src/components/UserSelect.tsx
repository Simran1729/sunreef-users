// import React, { useEffect } from 'react';
// import { useVoice } from "@/context/VoiceContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import logo from '../assets/logo4.png';
// import bg from '../assets/bg1.png';

// export default function UserSelect() {
//   const { setSelectedUser, setStep } = useVoice();
  
//   useEffect(() => {
//     setSelectedUser("Nicolas Lapp");
//   }, []);

//   const handleContinue = () => {
//     setStep(2);
//   };

//   return (
//     <main className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-gray-100 p-4 "
//     style={{
//       backgroundImage: `url(${bg})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundRepeat: 'no-repeat',
//       minHeight: '100vh',
//     }}>
//       <div className="w-full max-w-lg flex flex-col items-center gap-4">

//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="w-full"
//         >
//           <Card className="transform transition-all hover:shadow-xl border border-gray-200">
//             <CardContent className="p-4 sm:p-6">
//               <div className="space-y-6 sm:space-y-8 text-center">
//                 <motion.div 
//                   className="space-y-2"
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2, duration: 0.5 }}
//                 >

//             <img
//                         src={logo}
//                         alt="App Logo"
//                         className="w-full h-8 object-contain rounded-lg border-gray-200 mb-8 mt-8 pr-2"
//                       />
//                   <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-black text-transparent bg-clip-text tracking-tight">
//                     Hi, Nicolas!
//                   </h1>
//                   <motion.p 
//                     className="text-base sm:text-lg text-gray-600 font-medium"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     Welcome back to your voice assistant
//                   </motion.p>
//                 </motion.div>
                
//                 <motion.div 
//                   className="relative"
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ delay: 0.6, duration: 0.5 }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg blur opacity-10"></div>
//                   <div className="relative bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
//                     <p className="text-gray-700 text-base sm:text-lg">
//                       Your personal AI assistant is ready to help you
//                     </p>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8, duration: 0.5 }}
//                   className="pt-2 flex justify-center"
//                 >
//                   <Button 
//                     onClick={handleContinue}
//                     className="w-full mb-4 xs:w-3/4 sm:w-2/4 py-6 text-md font-medium bg-gray-900 hover:bg-gray-800 transition-all duration-300 rounded-md shadow-md flex items-center justify-center gap-2"
//                   >
//                     Let's Get Started
//                     <ArrowRight size={18} />
//                   </Button>
//                 </motion.div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo4.png";
import bg1 from "../assets/img1.jpg";
import bg2 from "../assets/img2.jpg";
import bg3 from "../assets/img3.jpg";
import bg4 from "../assets/img4.jpg";
import bg5 from "../assets/img5.jpg";
import bg6 from "../assets/img6.jpg";
import bg7 from "../assets/img7.jpg";
import bg8 from "../assets/img8.jpg";
import bg9 from "../assets/img9.jpg";
import bg10 from "../assets/img10.jpg";
import bg11 from "../assets/img11.jpg";

export default function UserSelect() {
  const { setSelectedUser, setStep } = useVoice();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgroundImages = [
    bg1,
    bg2,
    bg3,
    bg4,
    bg5,
    bg6,
    bg7,
    bg8,
    bg9,
    bg10,
    bg11,
  ];

  useEffect(() => {
    setSelectedUser("Nicolas Lapp");

    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [setSelectedUser, backgroundImages.length]);

  const handleContinue = () => {
    setStep(2);
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence>
          {backgroundImages.map(
            (bg, index) =>
              index === currentBgIndex && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: -1,
                  }}
                />
              )
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-lg flex flex-col items-center gap-4 z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="transform transition-all hover:shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6 sm:space-y-8 text-center">
                <motion.div
                  className="space-y-2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="App Logo"
                    className="w-full h-8 object-contain rounded-lg border-gray-200 mb-8 mt-8 pr-2"
                  />
                  <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-black text-transparent bg-clip-text tracking-tight">
                    Hi, Nicolas!
                  </h1>
                  <motion.p
                    className="text-base sm:text-lg text-gray-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Welcome back to your voice assistant
                  </motion.p>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg blur opacity-10"></div>
                  <div className="relative bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-700 text-base sm:text-lg">
                      Your personal AI assistant is ready to help you
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="pt-2 flex justify-center"
                >
                  <Button
                    onClick={handleContinue}
                    className="w-full mb-4 xs:w-3/4 sm:w-2/4 py-6 text-md font-medium bg-gray-900 hover:bg-gray-800 transition-all duration-300 rounded-md shadow-md flex items-center justify-center gap-2"
                  >
                    Let's Get Started
                    <ArrowRight size={18} />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
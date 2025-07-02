// import { useEffect, useState } from "react";
// import { useVoice } from "@/context/VoiceContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowRight, Search, Loader2 } from "lucide-react";
// import logo from "../assets/logo4.png";
// import bg1 from "../assets/img1.jpg";
// import bg2 from "../assets/img2.jpg";
// import bg3 from "../assets/img3.jpg";
// import bg4 from "../assets/img4.jpg";
// import bg5 from "../assets/img5.jpg";
// import bg6 from "../assets/img6.jpg";
// import bg7 from "../assets/img7.jpg";
// import bg8 from "../assets/img8.jpg";
// import bg9 from "../assets/img9.jpg";
// import bg10 from "../assets/img10.jpg";
// import bg11 from "../assets/img11.jpg";
// import { useToast } from "@/hooks/use-toast";
// import { Input } from "@/components/ui/input";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// interface User {
//   name: string;
//   id: string;
//   cf: {
//     cf_email: string;
//   };
// }

// export default function UserSelect() {
//   const { setSelectedUser, setStep, selectedUser } = useVoice();
//   const [currentBgIndex, setCurrentBgIndex] = useState(0);
//   const [welcomeScreen, setWelcomeScreen] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [open, setOpen] = useState(false);
//   const { selectedEmail, setSelectedEmail } = useVoice();
//   const { toast } = useToast();

//   const backgroundImages = [
//     bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11,
//   ];

//   useEffect(() => {
//     const intervalId = setInterval(() => { 
//       setCurrentBgIndex((prevIndex) =>
//         prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [backgroundImages.length]);

//   const handleGetStarted = () => {
//     setWelcomeScreen(false);
//     fetchUsers();
//   };

//   const fetchUsers = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch('https://sunreef-users-backend.vercel.app/get-users');
      
//       // Handle timeout
//       const timeoutId = setTimeout(() => {
//         setLoading(false);
//         setError("Request timed out. Please try again.");
//         toast({
//           title: "Connection Error",
//           description: "Request timed out. Please check your connection and try again.",
//           variant: "destructive"
//         });
//       }, 10000); // 10 second timeout
      
//       const data = await response.json();
//       console.log("response from users : ", data);
//       clearTimeout(timeoutId);
      
//       if (data && data.data) {
//         setUsers(data.data);
//       } else {
//         throw new Error("Invalid data format received");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch users");
//       toast({
//         title: "Error",
//         description: err instanceof Error ? err.message : "Failed to fetch users",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectUser = (user: User) => {
//     setSelectedUser(user.name);
//     setSelectedEmail(user.cf.cf_email);
//     setOpen(false);
//   };

//   const handleContinue = () => {
//     if (!selectedUser) {
//       toast({
//         title: "Selection Required",
//         description: "Please select a user to continue",
//         variant: "destructive"
//       });
//       return;
//     }
//     setStep(2);
//   };

//   // Key change: Only show users when searchQuery has content
//   const handleSearchChange = (value: string) => {
//     setSearchQuery(value);
    
//     // Only keep popover open if there's search text
//     if (value.trim().length > 0) {
//       setOpen(true);
//     } else {
//       setOpen(false);
//     }
//   };

//   // Filter users only when there's a search query
//   const filteredUsers = searchQuery.trim()
//     ? users.filter(user => 
//         user.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     : [];

//   return (
//     <main className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
//       <div className="absolute inset-0 w-full h-full">
//         <AnimatePresence>
//           {backgroundImages.map(
//             (bg, index) =>
//               index === currentBgIndex && (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 2, ease: "easeInOut" }}
//                   className="absolute inset-0 w-full h-full"
//                   style={{
//                     backgroundImage: `url(${bg})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     backgroundRepeat: "no-repeat",
//                     zIndex: -1,
//                   }}
//                 />
//               )
//           )}
//         </AnimatePresence>
//       </div>

//       <div className="w-full max-w-lg flex flex-col items-center gap-4 z-10">
//         <AnimatePresence mode="wait">
//           {welcomeScreen ? (
//             <motion.div
//               key="welcome"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ duration: 0.5 }}
//               className="w-full"
//             >
//               <Card className="transform transition-all hover:shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
//                 <CardContent className="p-4 sm:p-6">
//                   <div className="space-y-6 sm:space-y-8 text-center">
//                     <motion.div
//                       className="space-y-2"
//                       initial={{ y: -20, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ delay: 0.2, duration: 0.5 }}
//                     >
//                       <img
//                         src={logo || "/placeholder.svg"}
//                         alt="App Logo"
//                         className="w-full h-8 object-contain rounded-lg border-gray-200 mb-8 mt-8 pr-2"
//                       />
//                       <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-black text-transparent bg-clip-text tracking-tight">
//                         Welcome!
//                       </h1>
//                       <motion.p
//                         className="text-base sm:text-lg text-gray-600 font-medium"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.4 }}
//                       >
//                         Your voice assistant is ready to help
//                       </motion.p>
//                     </motion.div>

//                     <motion.div
//                       className="relative"
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       transition={{ delay: 0.6, duration: 0.5 }}
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg blur opacity-10"></div>
//                       <div className="relative bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
//                         <p className="text-gray-700 text-base sm:text-lg">
//                           Your personal AI assistant is ready to help you
//                         </p>
//                       </div>
//                     </motion.div>

//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.8, duration: 0.5 }}
//                       className="pt-2 flex justify-center"
//                     >
//                       <Button
//                         onClick={handleGetStarted}
//                         className="w-full mb-4 xs:w-3/4 sm:w-2/4 py-6 text-md font-medium bg-gray-900 hover:bg-gray-800 transition-all duration-300 rounded-md shadow-md flex items-center justify-center gap-2"
//                       >
//                         Let's Get Started
//                         <ArrowRight size={18} />
//                       </Button>
//                     </motion.div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="user-select"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ duration: 0.5 }}
//               className="w-full"
//             >
//               <Card className="transform transition-all hover:shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
//                 <CardContent className="p-4 sm:p-6">
//                   <div className="space-y-6 sm:space-y-8">
//                     <motion.div
//                       className="space-y-2"
//                       initial={{ y: -20, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ delay: 0.2, duration: 0.5 }}
//                     >
//                       <img
//                         src={logo || "/placeholder.svg"}
//                         alt="App Logo"
//                         className="w-full h-8 object-contain rounded-lg border-gray-200 mb-8 mt-8 pr-2"
//                       />
//                       <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-black text-transparent bg-clip-text tracking-tight">
//                         Select Your Profile
//                       </h1>
//                       <motion.p
//                         className="text-base text-gray-600 font-medium mb-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.4 }}
//                       >
//                         Choose your name to continue
//                       </motion.p>
//                     </motion.div>

//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.4 }}
//                       className="space-y-4"
//                     >
//                       {loading ? (
//                         <div className="flex flex-col items-center justify-center py-6">
//                           <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
//                           <p className="text-gray-500">Loading users...</p>
//                         </div>
//                       ) : error ? (
//                         <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
//                           <p className="text-red-600">{error}</p>
//                           <Button 
//                             variant="outline" 
//                             className="mt-2"
//                             onClick={fetchUsers}
//                           >
//                             Try Again
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           <Popover open={open} onOpenChange={setOpen}>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 role="combobox"
//                                 aria-expanded={open}
//                                 className="w-full justify-between h-12 text-left font-normal"
//                               >
//                                 {selectedUser ? (
//                                   <div className="flex flex-col items-start">
//                                     <span>{selectedUser}</span>
//                                     <span className="text-xs text-gray-500">{selectedEmail}</span>
//                                   </div>
//                                 ) : (
//                                   <span className="text-gray-500">Search for your name...</span>
//                                 )}
//                                 <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-full p-0" align="start">
//                               <Command>
//                                 <CommandInput 
//                                   placeholder="Type to search users..."
//                                   className="h-9"
//                                   value={searchQuery}
//                                   onValueChange={handleSearchChange}
//                                   autoFocus
//                                 />
//                                 <CommandList>
//                                   {searchQuery.trim() === "" ? (
//                                     <div className="py-6 text-center text-sm text-gray-500">
//                                       Start typing to search for users
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <CommandEmpty>No users found.</CommandEmpty>
//                                       <CommandGroup heading="Users">
//                                         {filteredUsers.map((user) => (
//                                           <CommandItem
//                                             key={user.id}
//                                             value={user.name}
//                                             onSelect={() => handleSelectUser(user)}
//                                             className="flex flex-col items-start py-3"
//                                           >
//                                             <span className="font-medium">{user.name}</span>
//                                             <span className="text-xs text-gray-500">{user.cf.cf_email}</span>
//                                           </CommandItem>
//                                         ))}
//                                       </CommandGroup>
//                                     </>
//                                   )}
//                                 </CommandList>
//                               </Command>
//                             </PopoverContent>
//                           </Popover>

//                           {selectedUser && (
//                             <motion.div
//                               initial={{ opacity: 0, y: 10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               className="bg-gray-50 p-4 rounded-md border border-gray-200"
//                             >
//                               <p className="text-gray-700 font-medium">Selected User:</p>
//                               <p className="text-gray-900">{selectedUser}</p>
//                               <p className="text-gray-500 text-sm">{selectedEmail}</p>
//                             </motion.div>
//                           )}
//                         </div>
//                       )}
//                     </motion.div>

//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.8, duration: 0.5 }}
//                       className="pt-2 flex justify-center"
//                     >
//                       <Button
//                         onClick={handleContinue}
//                         disabled={!selectedUser || loading}
//                         className="w-full mb-4 xs:w-3/4 sm:w-2/4 py-6 text-md font-medium bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 transition-all duration-300 rounded-md shadow-md flex items-center justify-center gap-2"
//                       >
//                         Continue
//                         <ArrowRight size={18} />
//                       </Button>
//                     </motion.div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>      
//     </main>
//   );
// }



import { useEffect, useState } from "react";
import { useVoice } from "@/context/VoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface User {
  name: string;
  id: string;
  cf: {
    cf_email: string;
  };
}
const steps = [
  { text: " 1. Open the Url on the browser" },
  { text: "2. Click on the dots" },
  { text: "3. Now click on Add to Home Screen" },
];

export default function UserSelect() {
  const { setSelectedUser, setStep, selectedUser } = useVoice();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [welcomeScreen, setWelcomeScreen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { selectedEmail, setSelectedEmail } = useVoice();
  const { toast } = useToast();

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
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [backgroundImages.length]);

  const handleGetStarted = () => {
    setWelcomeScreen(false);
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://sunreef-users-backend.vercel.app/get-users"
      );

      // Handle timeout
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError("Request timed out. Please try again.");
        toast({
          title: "Connection Error",
          description:
            "Request timed out. Please check your connection and try again.",
          variant: "destructive",
        });
      }, 10000); // 10 second timeout

      const data = await response.json();
      console.log("response from users : ", data);
      clearTimeout(timeoutId);

      if (data && data.data) {
        setUsers(data.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user.name);
    setSelectedEmail(user.cf.cf_email);
    setOpen(false);
  };

  const handleContinue = () => {
    if (!selectedUser) {
      toast({
        title: "Selection Required",
        description: "Please select a user to continue",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  // Key change: Only show users when searchQuery has content
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Only keep popover open if there's search text
    if (value.trim().length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // Filter users only when there's a search query
  const filteredUsers = searchQuery.trim()
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
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
        <AnimatePresence mode="wait">
          {welcomeScreen ? (
            <motion.div
            key="welcome"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
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
                        Welcome!
                      </h1>
                      <motion.p
                        className="text-base sm:text-lg text-gray-600 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        >
                        Your voice assistant is ready to help
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
                        onClick={handleGetStarted}
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
          ) : (
            <motion.div
            key="user-select"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
            >
              <Card className="transform transition-all hover:shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-6 sm:space-y-8">
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
                      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-black text-transparent bg-clip-text tracking-tight">
                        Select Your Profile
                      </h1>
                      <motion.p
                        className="text-base text-gray-600 font-medium mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Choose your name to continue
                      </motion.p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-4"
                      >
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-6">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
                          <p className="text-gray-500">Loading users...</p>
                        </div>
                      ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                          <p className="text-red-600">{error}</p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={fetchUsers}
                          >
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between h-12 text-left font-normal"
                                >
                                {selectedUser ? (
                                  <div className="flex flex-col items-start">
                                    <span>{selectedUser}</span>
                                    <span className="text-xs text-gray-500">
                                      {selectedEmail}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">
                                    Search for your name...
                                  </span>
                                )}
                                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="start"
                              >
                              <Command>
                                <CommandInput
                                  placeholder="Type to search users..."
                                  className="h-9"
                                  value={searchQuery}
                                  onValueChange={handleSearchChange}
                                  autoFocus
                                  />
                                <CommandList>
                                  {searchQuery.trim() === "" ? (
                                    <div className="py-6 text-center text-sm text-gray-500">
                                      Start typing to search for users
                                    </div>
                                  ) : (
                                    <>
                                      <CommandEmpty>
                                        No users found.
                                      </CommandEmpty>
                                      <CommandGroup heading="Users">
                                        {filteredUsers.map((user) => (
                                          <CommandItem
                                          key={user.id}
                                          value={user.name}
                                          onSelect={() =>
                                            handleSelectUser(user)
                                          }
                                          className="flex flex-col items-start py-3"
                                          >
                                            <span className="font-medium">
                                              {user.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {user.cf.cf_email}
                                            </span>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {selectedUser && (
                            <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 p-4 rounded-md border border-gray-200"
                            >
                              <p className="text-gray-700 font-medium">
                                Selected User:
                              </p>
                              <p className="text-gray-900">{selectedUser}</p>
                              <p className="text-gray-500 text-sm">
                                {selectedEmail}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="pt-2 flex justify-center"
                      >
                      <Button
                        onClick={handleContinue}
                        disabled={!selectedUser || loading}
                        className="w-full mb-4 xs:w-3/4 sm:w-2/4 py-6 text-md font-medium bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 transition-all duration-300 rounded-md shadow-md flex items-center justify-center gap-2"
                        >
                        Continue
                        <ArrowRight size={18} />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {welcomeScreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="w-full max-w-lg"
            >
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow p-3 border border-gray-200">
              <h3 className="text-sm font-semibold text-slate-800 text-center mb-3">
                Download Instructions
              </h3>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <p className="text-xs text-slate-700 font-medium ">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
        </main>
              </>
  );
}
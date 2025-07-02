import { useVoice } from "@/context/VoiceContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, type TicketFormData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect, useMemo } from "react";
import { departments, getTeamsForDepartment } from "@/lib/departments";
import FileUpload from "./FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Search } from "lucide-react";

interface ProjectCode {
  cf: {};
  layout: {};
  name: string;
}

export default function TicketForm() {
  const { extractedData, selectedUser, setStep, setTicketId, selectedEmail, step } = useVoice();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [apiProcessing, setApiProcessing] = useState(false);
  
  // Project Code related state
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>([]);
  const [projectCodesLoading, setProjectCodesLoading] = useState(false);
  const [projectCodeSearchQuery, setProjectCodeSearchQuery] = useState("");
  const [projectCodePopoverOpen, setProjectCodePopoverOpen] = useState(false);
  const [selectedProjectCode, setSelectedProjectCode] = useState("");
  
  let ticketNum;

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: extractedData || {
      projectCode: "",
      departmentName: "",
      teamName: "",
      severity: "",
      description: "",
      subject: "",
      priority: "",
    },
  });

  // Fetch project codes from backend
  const fetchProjectCodes = async () => {
    setProjectCodesLoading(true);
    try {
      const response = await fetch("https://sunreef-users-backend.vercel.app/get-projectcode", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch project codes");
      }
      
      const res = await response.json();
      console.log("Project codes response:", res);
      
      if (res.data && Array.isArray(res.data)) {
        setProjectCodes(res.data);
      } else {
        throw new Error("Invalid project codes data format");
      }
    } catch (error) {
      console.error("Failed to fetch project codes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch project codes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProjectCodesLoading(false);
    }
  };

  // Load project codes on component mount
  useEffect(() => {
    fetchProjectCodes();
  }, []);

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      form.reset(extractedData);
      setSelectedDepartment(extractedData.departmentName);
      form.setValue("severity", extractedData.severity);
      form.setValue("priority", extractedData.priority);
      
      // Set selected project code for the dropdown
      setSelectedProjectCode(extractedData.projectCode || "");
    }
  }, [extractedData, form]);
  
  // Compute availableTeams dynamically instead of using state
  const availableTeams = useMemo(() => {
    return selectedDepartment ? getTeamsForDepartment(selectedDepartment) : [];
  }, [selectedDepartment]);
  
  useEffect(() => {
    if (availableTeams.length > 0) {
      const currentTeam = form.watch("teamName");
  
      if (!currentTeam || !availableTeams.includes(currentTeam)) {
        const validTeam = availableTeams.includes(extractedData?.teamName ?? "")
        ? extractedData?.teamName ?? ""
        : availableTeams[0];
  
        form.setValue("teamName", validTeam);
      }
    }
  }, [availableTeams, extractedData, form]);

  // Handle project code search
  const handleProjectCodeSearchChange = (value: string) => {
    setProjectCodeSearchQuery(value);
    
    if (value.trim().length > 0) {
      setProjectCodePopoverOpen(true);
    } else {
      setProjectCodePopoverOpen(false);
    }
  };

  // Handle project code selection
  const handleSelectProjectCode = (projectCode: ProjectCode) => {
    setSelectedProjectCode(projectCode.name);
    form.setValue("projectCode", projectCode.name);
    setProjectCodePopoverOpen(false);
    setProjectCodeSearchQuery("");
  };

  // Filter project codes based on search query
  const filteredProjectCodes = projectCodeSearchQuery.trim()
    ? projectCodes.filter(project => 
        project.name.toLowerCase().includes(projectCodeSearchQuery.toLowerCase()))
    : [];

  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: async (data: TicketFormData) => {
      // Start with initial progress
      setProgress(10);
      
      // Slower progress increment - every 500ms instead of 200ms
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          // Slower progression that caps at 65% (saving rest for actual API response)
          if (prev < 65) {
            return prev + 3;
          }
          return prev;
        });
      }, 500);

      try {
        // Set API processing state to true to show loading indicator
        setApiProcessing(true);
        
        // Display processing toast
        toast({
          title: "Processing",
          description: "Creating your ticket, please wait...",
        });
        
        // Create FormData to handle file uploads
        const formData = new FormData();

        // Extract form data manually
        formData.append("subject", data.subject);
        formData.append("departmentId", data.departmentName);
        formData.append("description", data.description);
        formData.append("team", data.teamName);
        formData.append("severity", data.severity);
        formData.append("priority", data.priority);
        formData.append("ticketCreator", selectedUser || "");
        formData.append("ticketCreatorMail", selectedEmail || "");
        formData.append("projectCode", data.projectCode);
        
        // Add attachments
        attachments.forEach((file, index) => {
          formData.append(`files`, file);
        });

        // Use fetch directly for FormData
        const response = await fetch('https://sunreef-users-backend.vercel.app/api/create-ticket', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create ticket');
        }

        const responseData = await response.json();
        ticketNum = responseData.ticketNumber;
        console.log("ticketNum resp: ", ticketNum);

        // API completed successfully - set to 100%
        setTicketId(ticketNum);
        setProgress(100);
        return ticketNum || `TKT-0000`;
      } finally {
        clearInterval(intervalId);
        setApiProcessing(false);
      }
    },
    onSuccess: (ticketNum) => {
      toast({
        title: "Success",
        description: "Ticket created successfully!",
        variant: "success",
        duration: 2000,
      });

      setTicketId(ticketNum);
      setTimeout(() => {
        setStep(4);
      }, 1000);
    },
    onError: () => {
      setProgress(0);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Review Ticket Details</h2>

          <Form {...form}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit((data) => createTicket(data))(e);
              }} 
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Project Code
                      {step === 3 && extractedData?.projectCode === "" && (
                        <span className="text-xs text-red-500 font-normal">
                          (Please select a valid project code)
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {/* Show dropdown if project code is empty, otherwise show input */}
                      {extractedData?.projectCode === "" ? (
                        <div className="space-y-2">
                          <Popover open={projectCodePopoverOpen} onOpenChange={setProjectCodePopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={projectCodePopoverOpen}
                                className="w-full justify-between h-12 text-left font-normal"
                              >
                                {selectedProjectCode ? (
                                  <span>{selectedProjectCode}</span>
                                ) : (
                                  <span className="text-gray-500">Search for project code...</span>
                                )}
                                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput 
                                  placeholder="Type to search project codes..."
                                  className="h-9"
                                  value={projectCodeSearchQuery}
                                  onValueChange={handleProjectCodeSearchChange}
                                  autoFocus
                                />
                                <CommandList>
                                  {projectCodesLoading ? (
                                    <div className="py-6 text-center text-sm text-gray-500">
                                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                                      Loading project codes...
                                    </div>
                                  ) : projectCodeSearchQuery.trim() === "" ? (
                                    <div className="py-6 text-center text-sm text-gray-500">
                                      Start typing to search for project codes
                                    </div>
                                  ) : (
                                    <>
                                      <CommandEmpty>No project codes found.</CommandEmpty>
                                      <CommandGroup heading="Project Codes">
                                        {filteredProjectCodes.map((project) => (
                                          <CommandItem
                                            key={project.name}
                                            value={project.name}
                                            onSelect={() => handleSelectProjectCode(project)}
                                            className="py-3"
                                          >
                                            <span className="font-medium">{project.name}</span>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          
                          {selectedProjectCode && (
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                              <p className="text-gray-700 font-medium text-sm">Selected Project Code:</p>
                              <p className="text-gray-900">{selectedProjectCode}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Input {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        setSelectedDepartment(value);
                        form.setValue("departmentName", value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={!selectedDepartment}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTeams.map((team) => (
                          <SelectItem key={team} value={team}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select
                      value={field.value || "Major"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Minor", "Major", "Critical", "Show Stopper"].map((severity) => (
                          <SelectItem key={severity} value={severity}>
                            {severity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={field.value || "Medium"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Low", "Medium", "High", "Critical"].map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileUpload
                onFilesChange={setAttachments}
                className="mt-4"
                showError={(msg) =>
                  toast({
                    title: "File Too Large",
                    description: msg,
                    variant: "destructive",
                    duration: 4000,
                  })
                }
              />

              {isPending && (
                <div className="space-y-2">
                  <Progress value={progress} className="mb-2" />
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {apiProcessing && (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing request...</span>
                        </>
                      )}
                      {!apiProcessing && progress < 100 && (
                        <span>Preparing submission...</span>
                      )}
                      {progress === 100 && (
                        <span>Ticket creation complete!</span>
                      )}
                    </div>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Ticket"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

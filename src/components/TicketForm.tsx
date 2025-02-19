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

export default function TicketForm() {
  const { extractedData, selectedUser } = useVoice();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: extractedData || {
      projectCode: "",
      departmentName: "",
      teamName: "",
      severity: "",
      description: "",
      subject: "",
    },
  });

  // useEffect(() => {
  //   if (extractedData && Object.keys(extractedData).length > 0) {
  //     form.reset(extractedData);
  //     setSelectedDepartment(extractedData.departmentName);
  //     form.setValue("severity", extractedData.severity.toLowerCase());
  //   }
  // }, [extractedData, form]);
  

  // console.log("extracted data is : ", extractedData);
  // const allValues = form.watch();

  // useEffect(() => {
  //   console.log("Current Form Values:", allValues);
  // }, [allValues]);

  // // Get available teams based on selected department
  // const availableTeams = selectedDepartment
  //   ? getTeamsForDepartment(selectedDepartment)
  //   : [];

  // console.log("teams are : ", availableTeams)

  // // Update teams when department changes
  // useEffect(() => {
  //   if (selectedDepartment) {
  //     form.setValue("departmentName", selectedDepartment);
  //     form.setValue("teamName", availableTeams[0] || "");
  //     console.log("use effect ran here:")
  //   }
  // }, [selectedDepartment]);

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      form.reset(extractedData); // ✅ Reset form when extractedData loads
      setSelectedDepartment(extractedData.departmentName); // ✅ Set department first
      form.setValue("severity", extractedData.severity.toLowerCase());
    }
  }, [extractedData, form]);
  
  // 🟢 Compute availableTeams dynamically instead of using state
  const availableTeams = useMemo(() => {
    return selectedDepartment ? getTeamsForDepartment(selectedDepartment) : [];
  }, [selectedDepartment]);
  
  useEffect(() => {
    if (availableTeams.length > 0) {
      const currentTeam = form.watch("teamName"); // Get current team name
  
      if (!currentTeam || !availableTeams.includes(currentTeam)) {
        // ✅ Only update if teamName is not set OR not in availableTeams
        const validTeam = availableTeams.includes(extractedData?.teamName ?? "")
        ? extractedData?.teamName ?? ""
        : availableTeams[0];
  
        form.setValue("teamName", validTeam);
      }
    }
  }, [availableTeams, extractedData, form]);
  

  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: async (data: TicketFormData) => {
      const intervalId = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      try {
        // Create FormData to handle file uploads
        const formData = new FormData();

        // Extract form data manually
        formData.append("subject", data.subject);
        formData.append("departmentId", data.departmentName);
        formData.append("description", data.description);
        formData.append("team", data.teamName);
        formData.append("severity", data.severity);
        formData.append("ticketCreator", selectedUser || ""); // Ensure selectedUser is included
        formData.append("projectCode", data.projectCode);
        // Add attachments
        attachments.forEach((file, index) => {
          formData.append(`files`, file);
        });

        console.log(formData);
        console.log("Data is : ", data);

        // Use fetch directly for FormData
        const response = await fetch('https://voice-ticket-backend-attch.vercel.app/api/create-ticket', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to create ticket');
        }

        setProgress(100);
      } finally {
        clearInterval(intervalId);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket created successfully!",
      });
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 1500); 
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
              {/* <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Code <span className="text-xs text-red-500 font-normal">(Please ensure code is valid)</span>
                       </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      value={field.value || "medium"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Minor", "Major", "Critical", "Show Stopper"].map((severity) => (
                          <SelectItem key={severity} value={severity.toLowerCase()}>
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
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileUpload 
                onFilesChange={setAttachments}
                className="mt-4"
              />

              {isPending && (
                <Progress value={progress} className="mb-2" />
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  Generate Ticket
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
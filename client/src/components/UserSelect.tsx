import { useVoice } from "@/context/VoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function UserSelect() {
  const { setSelectedUser, setStep } = useVoice();
  const { data: users, isLoading } = useQuery<User[]>({ 
    queryKey: ["/api/users"]
  });

  const handleSelect = (value: string) => {
    setSelectedUser(value);
    setStep(2);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select User</h2>
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.username}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

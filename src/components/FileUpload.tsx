import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileImage, FileVideo, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  className?: string;
  showError?: (msg: string) => void;  // 🆕 Add this
}

export default function FileUpload({ onFilesChange, className ,showError}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.length) return;

  //   const newFiles = Array.from(e.target.files);
  //   setFiles([...files, ...newFiles]);
  //   onFilesChange([...files, ...newFiles]);

  //   // Generate previews for new files
  //   newFiles.forEach(file => {
  //     if (file.type.startsWith('image/')) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setPreviews(prev => [...prev, reader.result as string]);
  //       };
  //       reader.readAsDataURL(file);
  //     } else if (file.type.startsWith('video/')) {
  //       // For videos, we'll just show an icon
  //       setPreviews(prev => [...prev, 'video']);
  //     }
  //   });
  // };


  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
  
    const newFiles = Array.from(e.target.files);
    const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
    const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
  
    if (oversizedFiles.length > 0 && showError) {
      showError(`Some files exceeded the 15MB limit:\n${oversizedFiles.map(f => f.name).join(", ")}`);
    }
  
    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  
    // Generate previews
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setPreviews(prev => [...prev, 'video']);
      } else {
        setPreviews(prev => [...prev, '']);
      }
    });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Add Media
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group aspect-square border rounded-lg overflow-hidden bg-muted"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileVideo className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 text-xs truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

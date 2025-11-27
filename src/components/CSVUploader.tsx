import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CSVUploaderProps {
  onFileUpload: (file: File) => void;
}

const CSVUploader = ({ onFileUpload }: CSVUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-lg border-2 border-dashed border-border p-12">
      <Upload className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">Upload Sales Data</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Upload your CSV file to analyze sales performance, track trends, and gain insights
      </p>
      <label htmlFor="csv-upload">
        <Button asChild>
          <span className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Choose CSV File
          </span>
        </Button>
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default CSVUploader;

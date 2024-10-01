import { useDropzone, DropEvent, FileRejection, Accept } from 'react-dropzone';

function getColor({
  isDragAccept,
  isDragReject,
  isFocused,
}: {
  isDragAccept: boolean;
  isDragReject: boolean;
  isFocused: boolean;
}) {
  if (isDragAccept) return 'border-green-500';
  if (isDragReject) return 'border-red-500';
  if (isFocused) return 'border-blue-500';
  return 'border-gray-300';
}

export function ImageDropzone({
  accept = { 'image/*': [] },
  maxFiles = 1,
  onDrop,
}: {
  accept?: Accept;
  maxFiles?: number;
  onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
}) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept,
      maxFiles,
      onDrop,
    });

  const borderColor = getColor({ isDragAccept, isDragReject, isFocused });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 ${borderColor} border-dashed rounded-lg bg-gray-50 text-gray-500 transition-all duration-300 ease-in-out`}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop an image here, or click to select</p>
      </div>
    </div>
  );
}

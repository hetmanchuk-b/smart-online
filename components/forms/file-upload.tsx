"use client"

import {UploadDropzone} from "@/lib/uploadthing";
import '@uploadthing/react/styles.css';
import {toast} from "sonner";
import {Icons} from '@/components/icons';
import Image from 'next/image';
import {cn} from "@/lib/utils";


interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: string;
  disabled: boolean;
}

export const FileUpload = (
  {
    onChange,
    value,
    endpoint,
    disabled,
  }: FileUploadProps
) => {
  const handleRemove = () => {
    if (disabled) return;
    onChange('')
  }

  if (value) {
    return (
      <div className="relative w-44 h-44">
        <Image
          src={value}
          width={192}
          height={192}
          alt={'Uploaded'}
          className='rounded-md'
        />
        <button
          onClick={handleRemove}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type={'button'}
        >
          <Icons.close className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      appearance={{
        label: 'text-stone-700 hover:text-sky-700',
        allowedContent: 'text-lg',
        container: cn('border-input', disabled && 'cursor-not-allowed opacity-60'),
        button: 'bg-stone-600 ut-uploading:bg-stone-400'
      }}
      endpoint={!disabled ? endpoint : ''}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        toast.success(`File ${res?.[0].name} uploaded successfully.`);
      }}
      onUploadError={(error: Error) => {
        toast.error(`Sorry! Something went wrong: ${error.message}`);
        console.log(error);
      }}
      onUploadBegin={(name) => {
        toast.message(`Uploading: ${name}`);
      }}
    />
  )
}

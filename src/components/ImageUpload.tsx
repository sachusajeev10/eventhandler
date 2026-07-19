"use client"
import { useState, useRef } from "react"
import { getCloudinarySignature } from "@/actions/cloudinary"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      const { timestamp, signature, apiKey, cloudName } = await getCloudinarySignature()
      
      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey!)
      formData.append("timestamp", timestamp.toString())
      formData.append("signature", signature)
      formData.append("folder", "event-posters")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onChange(data.secure_url)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error(error)
      toast.error("Error uploading image")
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  if (value) {
    return (
      <div className="relative w-full h-48 rounded-md overflow-hidden border border-border">
        <Image
          fill
          style={{ objectFit: "cover" }}
          alt="Upload"
          src={value}
        />
        <div className="absolute top-2 right-2 z-10">
          <Button
            type="button"
            onClick={() => onChange("")}
            variant="destructive"
            size="icon"
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md h-48 hover:bg-muted/50 transition-colors">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleUpload}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload an Image
          </>
        )}
      </Button>
    </div>
  )
}

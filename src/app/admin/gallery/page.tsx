import { getGalleryImages, uploadToGallery, deleteGalleryImage } from "@/services/gallery";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default async function AdminGalleryPage() {
  const allImages = await getGalleryImages();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>
      <GalleryManager initialImages={allImages} />
    </div>
  );
}

"use client";

export function GalleryManager({ initialImages }: { initialImages: any[] }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle) return;

    try {
      setIsUploading(true);
      await uploadToGallery(uploadTitle, selectedFile);
      setUploadTitle("");
      setSelectedFile(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string | number) => {
    const confirmed = window.confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;

    try {
      await deleteGalleryImage(imageId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Upload Image</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Image title"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto flex-1"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full sm:w-auto flex-1"
            required
          />
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors w-full sm:w-auto"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialImages.map((image) => (
          <div key={image.id || image.url} className="relative border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
            <img
              src={image.url || image.src}
              alt={image.title || "Gallery Image"}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 flex items-center justify-between gap-2 border-t">
              <span className="text-sm font-medium truncate">{image.title}</span>
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors flex-shrink-0"
                aria-label="Delete Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { getGalleryImages } from "@/services/gallery";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Campus Gallery
        </h1>
        <p className="mt-2 text-base text-gray-600 sm:text-lg">
          Glimpses of life at our institution.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images?.map((image: any, index: number) => (
          <div
            key={image.id || index}
            className="group relative overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">{image.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
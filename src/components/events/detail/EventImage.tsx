interface EventImageProps {
  imageUrl: string;
}

export function EventImage({ imageUrl }: EventImageProps) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-800">
      <img 
        src={imageUrl}
        alt="Event cover"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
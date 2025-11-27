import Image, { type StaticImageData } from 'next/image';

export function EnemyCard({
  name,
  selected,
  onClick,
  imageSrc,
}: {
  name: string;
  imageSrc: string | StaticImageData;
  selected?: boolean;
  onClick?: () => void;
  imageAlt?: string;
}) {
  return (
<div
  onClick={onClick}
  className={`p-4 rounded-xl text-white text-center shadow-sm cursor-pointer transition flex flex-col items-center gap-2
    ${selected ? 'bg-red-600' : 'bg-white/20 hover:bg-white/30'}`}
>
  {imageSrc ? (
    <img
      src={imageSrc as string}
      alt={name}

      className="w-30 h-30 rounded-full border-2 border-white/50 object-cover"
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-sm">
      {name.charAt(0).toUpperCase()}
    </div>
  )}

  {/* Name always below the picture */}
  <span className="text-sm">{name}</span>
</div>

  );
}
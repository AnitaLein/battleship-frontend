export function EnemyCard({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 rounded-xl text-white text-center shadow-sm cursor-pointer transition
        ${selected ? 'bg-red-600' : 'bg-white/20 hover:bg-white/30'}`}
    >
      {name}
    </div>
  );
}
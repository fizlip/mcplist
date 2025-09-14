export default function ItemButton({ label, onClick }: { label: string, onClick: () => void }) {
    return (
      <button onClick={onClick} className="w-full text-left rounded-md p-1 text-xs underline hover:bg-blue-100 hover:cursor-pointer">
        {label}
      </button>
    );
} 
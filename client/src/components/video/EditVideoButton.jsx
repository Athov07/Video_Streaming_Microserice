import { Pencil } from "lucide-react";

export default function EditVideoButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mt-2"
    >
      <Pencil size={16} />
      Edit
    </button>
  );
}
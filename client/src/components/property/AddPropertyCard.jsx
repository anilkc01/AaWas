import { Plus } from "lucide-react";

export default function AddPropertyCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-xl
                 w-full min-h-[180px]
                 flex flex-col items-center justify-center
                 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600">
        <Plus size={24} />
      </div>
      <p className="text-xs font-medium text-gray-700 mt-2">
        Add New Property
      </p>
    </div>
  );
}

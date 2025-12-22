export default function AddPropertyCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed rounded-xl h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
    >
      <div className="text-5xl text-yellow-600 font-bold">＋</div>
      <p className="font-medium mt-2">Tap to Add new Property</p>
    </div>
  );
}

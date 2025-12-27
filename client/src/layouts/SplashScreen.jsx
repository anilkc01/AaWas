export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <img
        src="/logoRound.png"
        alt="logo"
        className="w-28 h-28 object-cover"
      />
    </div>
  );
}

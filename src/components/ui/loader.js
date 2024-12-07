export default function Loader({ className }) {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-100"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
    </div>
  );
}

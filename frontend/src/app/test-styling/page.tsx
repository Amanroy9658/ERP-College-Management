export default function TestStyling() {
  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-purple-600 text-2xl font-bold mb-4 text-center">
          Tailwind CSS Test
        </h1>
        
        <div className="space-y-4">
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
            Purple Button
          </button>
          
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <p className="text-purple-800 text-center">
              If you can see purple colors, Tailwind is working!
            </p>
          </div>
          
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-purple-200 rounded"></div>
            <div className="w-8 h-8 bg-purple-400 rounded"></div>
            <div className="w-8 h-8 bg-purple-600 rounded"></div>
            <div className="w-8 h-8 bg-purple-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

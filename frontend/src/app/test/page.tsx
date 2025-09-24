export default function TestPage() {
  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-purple-600 text-2xl font-bold mb-4">Tailwind CSS Test</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
          Purple Button
        </button>
        <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
          <p className="text-purple-800">Purple theme is working!</p>
        </div>
      </div>
    </div>
  );
}

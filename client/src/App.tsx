import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full p-8 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">NepaliPay</h1>
        <p className="text-gray-300 text-center mb-8">
          Blockchain-powered digital wallet for the Nepali financial ecosystem.
        </p>
        <div className="flex justify-center">
          <button
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-blue-600/30"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
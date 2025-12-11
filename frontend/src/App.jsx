import React from "react";

const App = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-900">
        <h1 className="text-3xl font-bold mb-3">interview-me</h1>
        <h3 className="text-lg">loading..</h3>

        {/* Deployment verification footer */}
        <p className="mt-6 text-sm text-slate-500">
          Deployment test page — React + Vite is running.
        </p>
      </div>
    </>
  );
};

export default App;

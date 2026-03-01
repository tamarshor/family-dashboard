"use client";

import { useState } from "react";

type Choice = "joke" | "song" | null;

export default function CreativePicker() {
  const [choice, setChoice] = useState<Choice>(null);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-blue-500 mb-4">
        Creative Picker
      </h2>

      {choice === null ? (
        <div>
          <p className="text-gray-600 mb-4">What are you in the mood for?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setChoice("joke")}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              Joke
            </button>
            <button
              onClick={() => setChoice("song")}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              Song
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-2xl mb-2">{choice === "joke" ? "\u{1F602}" : "\u{1F3B5}"}</p>
          <p className="text-lg font-medium text-gray-800">
            You picked: <span className="text-blue-500 capitalize">{choice}</span>!
          </p>
          <button
            onClick={() => setChoice(null)}
            className="mt-4 text-sm text-gray-400 hover:text-blue-500 transition-colors"
          >
            Pick again
          </button>
        </div>
      )}
    </div>
  );
}

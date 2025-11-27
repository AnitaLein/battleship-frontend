import { useState } from "react";

export default function CoordinateSelector(
    { setTargetField }: any
) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const numbers = [1, 2, 3, 4, 5, 6];

  const [letter, setLetter] = useState("");
  const [number, setNumber] = useState("");

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm">

    {/* Display Result */}
      <div className="text-xl font-bold text-white text-center mb-4">
        {setTargetField(letter && number ? `${letter}${number}` : "")}
        <h3 className="text-white">Angriff auf Feld: {" "}</h3>
        {letter && number ? (
          <strong>
            {letter}{number}
          </strong>
        ) : (
          "Nichts ausgewählt"
        )}
      </div>
      
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {/* Letter Dropdown */}
      <div className="flex flex-col">
        <select
          className={`px-4 py-3 w-20 rounded-xl text-white text-center shadow-sm cursor-pointer transition
        ${letter ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
        >
          <option value=""> -- </option>
          {letters.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Number Dropdown */}
      <div className="flex flex-col">
        <select
          className={`px-4 py-3 w-20 rounded-xl text-white text-center shadow-sm cursor-pointer transition
        ${number ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        >
          <option value=""> -- </option>
          {numbers.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      </div>

    </div>
  );
}

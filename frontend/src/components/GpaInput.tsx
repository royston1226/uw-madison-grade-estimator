interface Props {
  gpa: number;
  onChange: (gpa: number) => void;
}

export function GpaInput({ gpa, onChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Cumulative GPA</label>
        <span className="text-2xl font-bold text-uw-red tabular-nums">{gpa.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={4}
        step={0.01}
        value={gpa}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-uw-red"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>0.00</span>
        <span>1.00</span>
        <span>2.00</span>
        <span>3.00</span>
        <span>4.00</span>
      </div>
    </div>
  );
}

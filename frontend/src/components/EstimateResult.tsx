import type { GradeEstimate } from '../types';

interface Props {
  estimate: GradeEstimate;
}

export function EstimateResult({ estimate }: Props) {
  const percentileLabel = Math.round(estimate.studentPercentile * 100);

  return (
    <div className="bg-uw-red text-white rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest opacity-75 mb-1">Estimated Grade</div>
          <div className="text-7xl font-black leading-none">{estimate.estimatedGrade}</div>
        </div>
        <div className="flex-1 border-l border-white/20 pl-6">
          <p className="text-sm leading-relaxed opacity-90">{estimate.message}</p>
          <p className="text-xs opacity-60 mt-3">
            A GPA of {estimate.gpa.toFixed(2)} is approximately the {percentileLabel}th percentile among UW–Madison students.
          </p>
        </div>
      </div>
    </div>
  );
}

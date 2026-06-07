import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import type { GradeDistribution } from '../types';

const GRADE_COLORS: Record<string, string> = {
  A:  '#15803d',
  AB: '#4d7c0f',
  B:  '#a16207',
  BC: '#c2410c',
  C:  '#b91c1c',
  D:  '#991b1b',
  F:  '#7f1d1d',
};

interface Props {
  distribution: GradeDistribution;
  highlightGrade?: string;
}

export function GradeDistributionChart({ distribution, highlightGrade }: Props) {
  const data = [
    { grade: 'A',  percent: distribution.aPercent },
    { grade: 'AB', percent: distribution.abPercent },
    { grade: 'B',  percent: distribution.bPercent },
    { grade: 'BC', percent: distribution.bcPercent },
    { grade: 'C',  percent: distribution.cPercent },
    { grade: 'D',  percent: distribution.dPercent },
    { grade: 'F',  percent: distribution.fPercent },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Grade Distribution</h2>
        <span className="text-xs text-gray-400">{distribution.gradedTotal.toLocaleString()} students</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="grade" tick={{ fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Students']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 13 }}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
            {data.map(entry => (
              <Cell
                key={entry.grade}
                fill={entry.grade === highlightGrade ? '#C5050C' : GRADE_COLORS[entry.grade]}
                opacity={highlightGrade && entry.grade !== highlightGrade ? 0.35 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

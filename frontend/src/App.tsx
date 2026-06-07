import { useState, useEffect } from 'react';
import { CourseSearch } from './components/CourseSearch';
import { GradeDistributionChart } from './components/GradeDistributionChart';
import { GpaInput } from './components/GpaInput';
import { EstimateResult } from './components/EstimateResult';
import { getGradeEstimate } from './api/courseApi';
import type { CourseSummary, GradeEstimate } from './types';

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<CourseSummary | null>(null);
  const [gpa, setGpa] = useState(3.0);
  const [debouncedGpa, setDebouncedGpa] = useState(3.0);
  const [estimate, setEstimate] = useState<GradeEstimate | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  // Debounce GPA so the API is only called once the slider settles
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedGpa(gpa), 300);
    return () => clearTimeout(timer);
  }, [gpa]);

  useEffect(() => {
    if (!selectedCourse) return;

    setLoadingEstimate(true);
    getGradeEstimate(selectedCourse.uuid, debouncedGpa)
      .then(setEstimate)
      .catch(console.error)
      .finally(() => setLoadingEstimate(false));
  }, [selectedCourse, debouncedGpa]);

  function handleClear() {
    setSelectedCourse(null);
    setEstimate(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-uw-red text-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold tracking-tight">UW–Madison Grade Estimator</h1>
          <p className="text-sm opacity-75 mt-0.5">
            See how your GPA aligns with historical course outcomes
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <CourseSearch
          selectedCourse={selectedCourse}
          onSelect={setSelectedCourse}
          onClear={handleClear}
        />

        {!selectedCourse && (
          <p className="text-center text-gray-400 text-sm pt-8">
            Search for a course above to get started
          </p>
        )}

        {selectedCourse && !estimate && loadingEstimate && (
          <div className="text-center text-gray-400 py-12">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-uw-red rounded-full animate-spin mx-auto mb-3" />
            Loading course data…
          </div>
        )}

        {selectedCourse && estimate && (
          <>
            <GradeDistributionChart
              distribution={estimate.distribution}
              highlightGrade={loadingEstimate ? undefined : estimate.estimatedGrade}
            />
            <GpaInput gpa={gpa} onChange={setGpa} />
            {loadingEstimate ? (
              <div className="bg-uw-red/10 rounded-xl p-6 flex items-center justify-center gap-3 text-uw-red text-sm">
                <div className="w-4 h-4 border-2 border-uw-red/30 border-t-uw-red rounded-full animate-spin" />
                Recalculating…
              </div>
            ) : (
              <EstimateResult estimate={estimate} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

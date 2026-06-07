import { useState, useEffect, useRef } from 'react';
import { searchCourses } from '../api/courseApi';
import type { CourseSummary } from '../types';

interface Props {
  selectedCourse: CourseSummary | null;
  onSelect: (course: CourseSummary) => void;
  onClear: () => void;
}

export function CourseSearch({ selectedCourse, onSelect, onClear }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CourseSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || selectedCourse) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await searchCourses(query);
        setResults(result.courses);
        setIsOpen(true);
      } catch {
        // silently ignore network errors during search
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [query, selectedCourse]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (selectedCourse) {
    return (
      <div className="flex items-center gap-3 bg-white border-2 border-uw-red rounded-xl px-4 py-3 shadow-sm">
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900">{selectedCourse.name}</div>
          <div className="text-sm text-gray-500">{selectedCourse.courseCodes.join(' · ')}</div>
        </div>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Clear selection"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a course (e.g. MATH 221, Calculus)"
          className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-uw-red transition-colors bg-white shadow-sm"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-300 border-t-uw-red rounded-full animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {results.map(course => (
            <li
              key={course.uuid}
              onMouseDown={() => { onSelect(course); setQuery(''); setIsOpen(false); }}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left"
            >
              <div className="font-medium text-gray-900">{course.name}</div>
              <div className="text-sm text-gray-500">{course.courseCodes.join(' · ')}</div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-gray-500 text-sm">
          No courses found for "{query}"
        </div>
      )}
    </div>
  );
}

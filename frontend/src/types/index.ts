export interface CourseSummary {
  uuid: string;
  number: number;
  name: string;
  courseCodes: string[];
}

export interface CourseSearchResult {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  courses: CourseSummary[];
}

export interface GradeDistribution {
  courseUuid: string;
  aPercent: number;
  abPercent: number;
  bPercent: number;
  bcPercent: number;
  cPercent: number;
  dPercent: number;
  fPercent: number;
  gradedTotal: number;
}

export interface GradeEstimate {
  courseUuid: string;
  gpa: number;
  studentPercentile: number;
  estimatedGrade: string;
  distribution: GradeDistribution;
  message: string;
}

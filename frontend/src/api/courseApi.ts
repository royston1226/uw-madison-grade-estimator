import axios from 'axios';
import type { CourseSearchResult, GradeEstimate } from '../types';

const BASE_URL = 'http://localhost:8080/api';

export async function searchCourses(query: string, page = 1, perPage = 10): Promise<CourseSearchResult> {
  const { data } = await axios.get(`${BASE_URL}/courses/search`, {
    params: { query, page, perPage },
  });
  return data;
}

export async function getGradeEstimate(uuid: string, gpa: number): Promise<GradeEstimate> {
  const { data } = await axios.get(`${BASE_URL}/courses/${uuid}/estimate`, {
    params: { gpa },
  });
  return data;
}

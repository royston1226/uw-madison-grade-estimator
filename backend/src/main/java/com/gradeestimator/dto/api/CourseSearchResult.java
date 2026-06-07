package com.gradeestimator.dto.api;

import java.util.List;

public record CourseSearchResult(
    int currentPage,
    int totalPages,
    int totalCount,
    List<CourseSummary> courses
) {}

package com.gradeestimator.dto.madgrades;

import java.util.List;

public record CourseSearchResponse(
    int currentPage,
    int totalPages,
    int totalCount,
    String nextPageUrl,
    List<CourseResult> results
) {}

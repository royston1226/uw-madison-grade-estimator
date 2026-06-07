package com.gradeestimator.dto.api;

public record GradeEstimateResponse(
    String courseUuid,
    double gpa,
    double studentPercentile,
    String estimatedGrade,
    GradeDistributionDto distribution,
    String message
) {}

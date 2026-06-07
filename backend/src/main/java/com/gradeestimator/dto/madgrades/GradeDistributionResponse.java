package com.gradeestimator.dto.madgrades;

public record GradeDistributionResponse(
    String courseUuid,
    GradeCounts cumulative
) {}

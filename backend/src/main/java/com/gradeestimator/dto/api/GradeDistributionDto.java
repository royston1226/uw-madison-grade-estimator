package com.gradeestimator.dto.api;

public record GradeDistributionDto(
    String courseUuid,
    double aPercent,
    double abPercent,
    double bPercent,
    double bcPercent,
    double cPercent,
    double dPercent,
    double fPercent,
    int gradedTotal
) {}

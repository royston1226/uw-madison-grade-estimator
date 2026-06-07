package com.gradeestimator.dto.api;

import java.util.List;

public record CourseSummary(
    String uuid,
    int number,
    String name,
    List<String> courseCodes
) {}

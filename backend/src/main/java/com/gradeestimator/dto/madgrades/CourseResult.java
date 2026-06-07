package com.gradeestimator.dto.madgrades;

import java.util.List;

public record CourseResult(
    String uuid,
    int number,
    String name,
    List<String> names,
    List<Subject> subjects,
    String url
) {}

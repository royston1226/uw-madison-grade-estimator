package com.gradeestimator.service;

import com.gradeestimator.client.MadgradesClient;
import com.gradeestimator.dto.api.CourseSummary;
import com.gradeestimator.dto.api.CourseSearchResult;
import com.gradeestimator.dto.api.GradeDistributionDto;
import com.gradeestimator.dto.api.GradeEstimateResponse;
import com.gradeestimator.dto.madgrades.CourseSearchResponse;
import com.gradeestimator.dto.madgrades.GradeDistributionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final MadgradesClient madgradesClient;
    private final GradeEstimationService gradeEstimationService;

    public CourseService(MadgradesClient madgradesClient, GradeEstimationService gradeEstimationService) {
        this.madgradesClient = madgradesClient;
        this.gradeEstimationService = gradeEstimationService;
    }

    public CourseSearchResult search(String query, int page, int perPage) {
        CourseSearchResponse resp = madgradesClient.searchCourses(query, page, perPage);
        List<CourseSummary> courses = resp.results().stream()
            .map(c -> new CourseSummary(
                c.uuid(),
                c.number(),
                c.name(),
                c.subjects().stream()
                    .map(s -> s.abbreviation() + " " + c.number())
                    .distinct()
                    .toList()
            ))
            .toList();
        return new CourseSearchResult(resp.currentPage(), resp.totalPages(), resp.totalCount(), courses);
    }

    public GradeDistributionDto getDistribution(String uuid) {
        GradeDistributionResponse resp = madgradesClient.getCourseGrades(uuid);
        return gradeEstimationService.toDistribution(uuid, resp.cumulative());
    }

    public GradeEstimateResponse estimate(String uuid, double gpa) {
        GradeDistributionResponse resp = madgradesClient.getCourseGrades(uuid);
        return gradeEstimationService.estimate(uuid, gpa, resp.cumulative());
    }
}

package com.gradeestimator.controller;

import com.gradeestimator.dto.api.CourseSearchResult;
import com.gradeestimator.dto.api.GradeDistributionDto;
import com.gradeestimator.dto.api.GradeEstimateResponse;
import com.gradeestimator.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/search")
    public ResponseEntity<CourseSearchResult> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int perPage) {
        return ResponseEntity.ok(courseService.search(query, page, perPage));
    }

    @GetMapping("/{uuid}/grades")
    public ResponseEntity<GradeDistributionDto> grades(@PathVariable String uuid) {
        return ResponseEntity.ok(courseService.getDistribution(uuid));
    }

    @GetMapping("/{uuid}/estimate")
    public ResponseEntity<GradeEstimateResponse> estimate(
            @PathVariable String uuid,
            @RequestParam double gpa) {
        if (gpa < 0.0 || gpa > 4.0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(courseService.estimate(uuid, gpa));
    }
}

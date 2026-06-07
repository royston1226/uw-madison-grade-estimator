package com.gradeestimator.service;

import com.gradeestimator.dto.api.GradeDistributionDto;
import com.gradeestimator.dto.api.GradeEstimateResponse;
import com.gradeestimator.dto.madgrades.GradeCounts;
import org.springframework.stereotype.Service;

@Service
public class GradeEstimationService {

    // Approximate UW-Madison cumulative GPA distribution parameters.
    // Mean ~3.20, std dev ~0.45 derived from published institutional data.
    private static final double MEAN_GPA = 3.20;
    private static final double STD_GPA  = 0.45;

    public GradeEstimateResponse estimate(String courseUuid, double gpa, GradeCounts counts) {
        double percentile = gpaToPercentile(gpa);
        GradeDistributionDto distribution = toDistribution(courseUuid, counts);
        String grade = mapPercentileToGrade(percentile, counts);
        String message = String.format(
            "Students with a GPA of %.2f have typically earned a grade of %s in this course.",
            gpa, grade
        );
        return new GradeEstimateResponse(courseUuid, gpa, Math.round(percentile * 1000.0) / 1000.0, grade, distribution, message);
    }

    public GradeDistributionDto toDistribution(String courseUuid, GradeCounts counts) {
        int graded = gradedTotal(counts);
        if (graded == 0) {
            return new GradeDistributionDto(courseUuid, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        return new GradeDistributionDto(
            courseUuid,
            round((double) counts.aCount()  / graded * 100),
            round((double) counts.abCount() / graded * 100),
            round((double) counts.bCount()  / graded * 100),
            round((double) counts.bcCount() / graded * 100),
            round((double) counts.cCount()  / graded * 100),
            round((double) counts.dCount()  / graded * 100),
            round((double) counts.fCount()  / graded * 100),
            graded
        );
    }

    // Maps a student's cumulative GPA to an estimated percentile rank among
    // UW-Madison students using a normal-distribution approximation.
    private double gpaToPercentile(double gpa) {
        double z = (Math.min(gpa, 4.0) - MEAN_GPA) / STD_GPA;
        return normalCDF(z);
    }

    // Maps a percentile rank to a letter grade using the course's historical
    // grade distribution, treating grades as ordered from lowest (F) to highest (A).
    private String mapPercentileToGrade(double percentile, GradeCounts counts) {
        int graded = gradedTotal(counts);
        if (graded == 0) return "N/A";

        double fCutoff  = (double) counts.fCount()  / graded;
        double dCutoff  = fCutoff  + (double) counts.dCount()  / graded;
        double cCutoff  = dCutoff  + (double) counts.cCount()  / graded;
        double bcCutoff = cCutoff  + (double) counts.bcCount() / graded;
        double bCutoff  = bcCutoff + (double) counts.bCount()  / graded;
        double abCutoff = bCutoff  + (double) counts.abCount() / graded;

        if (percentile <= fCutoff)  return "F";
        if (percentile <= dCutoff)  return "D";
        if (percentile <= cCutoff)  return "C";
        if (percentile <= bcCutoff) return "BC";
        if (percentile <= bCutoff)  return "B";
        if (percentile <= abCutoff) return "AB";
        return "A";
    }

    private int gradedTotal(GradeCounts counts) {
        return counts.aCount() + counts.abCount() + counts.bCount()
             + counts.bcCount() + counts.cCount() + counts.dCount() + counts.fCount();
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }

    private double normalCDF(double z) {
        return 0.5 * (1.0 + erf(z / Math.sqrt(2.0)));
    }

    // Abramowitz and Stegun approximation, max error ~1.5e-7
    private double erf(double x) {
        double t = 1.0 / (1.0 + 0.3275911 * Math.abs(x));
        double y = 1.0 - (((((1.061405429 * t - 1.453152027) * t)
                + 1.421413741) * t - 0.284496736) * t + 0.254829592)
                * t * Math.exp(-x * x);
        return Math.signum(x) * y;
    }
}

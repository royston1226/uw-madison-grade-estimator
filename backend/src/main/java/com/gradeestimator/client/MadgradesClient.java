package com.gradeestimator.client;

import com.gradeestimator.dto.madgrades.CourseSearchResponse;
import com.gradeestimator.dto.madgrades.GradeDistributionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class MadgradesClient {

    @Value("${madgrades.base-url}")
    private String baseUrl;

    @Value("${madgrades.api-token}")
    private String apiToken;

    private final RestTemplate restTemplate;

    public MadgradesClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CourseSearchResponse searchCourses(String query, int page, int perPage) {
        String url = baseUrl + "/courses?query={query}&page={page}&per_page={perPage}";
        return restTemplate.exchange(
            url, HttpMethod.GET, new HttpEntity<>(authHeaders()),
            CourseSearchResponse.class,
            query, page, perPage
        ).getBody();
    }

    public GradeDistributionResponse getCourseGrades(String uuid) {
        String url = baseUrl + "/courses/{uuid}/grades";
        return restTemplate.exchange(
            url, HttpMethod.GET, new HttpEntity<>(authHeaders()),
            GradeDistributionResponse.class,
            uuid
        ).getBody();
    }

    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Token token=" + apiToken);
        return headers;
    }
}

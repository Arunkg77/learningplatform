package com.example.learningplatform.controller;

import com.example.learningplatform.model.Course;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin("*")
public class CourseController {

    List<Course> courses = new ArrayList<>();

    public CourseController() {

        courses.add(new Course(
                1,
                "Java Basics",
                "Learn Java fundamentals",
                "6 Weeks"
        ));

        courses.add(new Course(
                2,
                "Web Development",
                "HTML CSS JavaScript",
                "8 Weeks"
        ));

        courses.add(new Course(
                3,
                "Spring Boot",
                "Backend Development",
                "5 Weeks"
        ));
    }

    @GetMapping
    public List<Course> getCourses() {
        return courses;
    }

    @GetMapping("/{id}")
    public Course getCourse(@PathVariable int id) {

        return courses.stream()
                .filter(course -> course.getId() == id)
                .findFirst()
                .orElse(null);
    }
}
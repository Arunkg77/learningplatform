package com.example.learningplatform.model;

public class Course {

    private int id;
    private String title;
    private String description;
    private String duration;

    public Course(int id, String title, String description, String duration) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDuration() {
        return duration;
    }
}
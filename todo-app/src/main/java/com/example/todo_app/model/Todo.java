package com.example.todo_app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String task;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private boolean completed = false;
    
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    private Category category = Category.PERSONAL;
    
    private LocalDateTime dueDate;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
    
    private LocalDateTime updatedAt;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    private String tags;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        } else if (!completed) {
            completedAt = null;
        }
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    public enum Category {
        PERSONAL, WORK, SHOPPING, HEALTH, EDUCATION, OTHER
    }
}
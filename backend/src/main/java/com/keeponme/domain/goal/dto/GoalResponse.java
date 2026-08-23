package com.keeponme.domain.goal.dto;

import com.keeponme.domain.goal.Goal;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record GoalResponse(
        Long id,
        Long userId,
        String type,
        String title,
        LocalDate targetDate,
        String dayOfWeek,
        String status,
        LocalDateTime createdAt
) {
    public static GoalResponse from(Goal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getUser().getId(),
                goal.getType().name(),
                goal.getTitle(),
                goal.getTargetDate(),
                goal.getDayOfWeek() != null ? goal.getDayOfWeek().name() : null,
                goal.getStatus().name(),
                goal.getCreatedAt()
        );
    }
}

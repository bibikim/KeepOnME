package com.keeponme.domain.goal.dto;

import java.util.List;

public record GoalListResponse(
        List<GoalResponse> daily,
        List<GoalResponse> weekly,
        double dailyAchievementRate,
        double weeklyAchievementRate
) {
}

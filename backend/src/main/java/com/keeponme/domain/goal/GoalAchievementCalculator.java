package com.keeponme.domain.goal;

import java.util.List;

public final class GoalAchievementCalculator {

    private GoalAchievementCalculator() {
    }

    /** 완료(COMPLETED/VERIFIED) 비율을 소수 첫째 자리까지 반올림한 퍼센트(0~100)로 반환한다. */
    public static double rate(List<Goal> goals) {
        if (goals.isEmpty()) {
            return 0.0;
        }
        long completed = goals.stream()
                .filter(goal -> goal.getStatus() != GoalStatus.PENDING)
                .count();
        return Math.round(completed * 1000.0 / goals.size()) / 10.0;
    }
}

package com.keeponme.domain.goal.dto;

import com.keeponme.domain.goal.GoalType;
import com.keeponme.domain.goal.WeekDay;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * DAILY 목표는 targetDate, dayOfWeek 중 하나 이상 있으면 되고(둘 다 있으면 서로 일치해야 함),
 * dayOfWeek만 주어지면 이번 주 해당 요일 날짜로 서버가 계산한다. WEEKLY 목표는 targetDate가
 * 필수이며 dayOfWeek는 허용하지 않는다. 이 상호 검증은 GoalService에서 수행한다.
 */
public record GoalCreateRequest(
        @NotNull GoalType type,
        @NotBlank @Size(max = 200) String title,
        LocalDate targetDate,
        WeekDay dayOfWeek
) {
}

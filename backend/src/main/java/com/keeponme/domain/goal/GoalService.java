package com.keeponme.domain.goal;

import com.keeponme.domain.goal.dto.GoalCreateRequest;
import com.keeponme.domain.goal.dto.GoalListResponse;
import com.keeponme.domain.goal.dto.GoalResponse;
import com.keeponme.domain.mate.MateRepository;
import com.keeponme.domain.mate.MateStatus;
import com.keeponme.domain.user.User;
import com.keeponme.domain.user.UserRepository;
import com.keeponme.global.error.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final MateRepository mateRepository;

    public GoalListResponse getGoals(User me, Long targetUserId, LocalDate targetDate, WeekDay dayOfWeek) {
        User target = resolveTargetUser(me, targetUserId);
        LocalDate referenceDate = targetDate != null ? targetDate : LocalDate.now();
        LocalDate weekStart = referenceDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate dailyDate = dayOfWeek != null ? weekStart.plusDays(dayOfWeek.ordinal()) : referenceDate;

        List<Goal> dailyGoals = goalRepository.findAllByUserAndTypeAndTargetDate(target, GoalType.DAILY, dailyDate);
        List<Goal> weeklyGoals = goalRepository.findAllByUserAndTypeAndTargetDate(target, GoalType.WEEKLY, weekStart);

        return new GoalListResponse(
                dailyGoals.stream().map(GoalResponse::from).toList(),
                weeklyGoals.stream().map(GoalResponse::from).toList(),
                GoalAchievementCalculator.rate(dailyGoals),
                GoalAchievementCalculator.rate(weeklyGoals)
        );
    }

    @Transactional
    public GoalResponse create(User me, GoalCreateRequest request) {
        Goal goal = request.type() == GoalType.WEEKLY ? buildWeeklyGoal(me, request) : buildDailyGoal(me, request);
        goalRepository.save(goal);
        return GoalResponse.from(goal);
    }

    private Goal buildWeeklyGoal(User me, GoalCreateRequest request) {
        if (request.targetDate() == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "TARGET_DATE_REQUIRED", "주간 목표는 targetDate가 필요합니다.");
        }
        if (request.dayOfWeek() != null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "DAY_OF_WEEK_NOT_ALLOWED", "주간 목표에는 dayOfWeek를 지정할 수 없습니다.");
        }

        LocalDate weekStart = request.targetDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        return Goal.builder()
                .user(me)
                .type(GoalType.WEEKLY)
                .title(request.title())
                .targetDate(weekStart)
                .build();
    }

    private Goal buildDailyGoal(User me, GoalCreateRequest request) {
        LocalDate targetDate;
        WeekDay dayOfWeek;

        if (request.targetDate() != null) {
            targetDate = request.targetDate();
            WeekDay derived = WeekDay.from(targetDate.getDayOfWeek());
            if (request.dayOfWeek() != null && request.dayOfWeek() != derived) {
                throw new CustomException(HttpStatus.BAD_REQUEST, "DAY_OF_WEEK_MISMATCH",
                        "targetDate와 dayOfWeek가 일치하지 않습니다.");
            }
            dayOfWeek = derived;
        } else if (request.dayOfWeek() != null) {
            LocalDate weekStart = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            dayOfWeek = request.dayOfWeek();
            targetDate = weekStart.plusDays(dayOfWeek.ordinal());
        } else {
            throw new CustomException(HttpStatus.BAD_REQUEST, "TARGET_DATE_OR_DAY_OF_WEEK_REQUIRED",
                    "일간 목표는 targetDate 또는 dayOfWeek 중 하나가 필요합니다.");
        }

        return Goal.builder()
                .user(me)
                .type(GoalType.DAILY)
                .title(request.title())
                .targetDate(targetDate)
                .dayOfWeek(dayOfWeek)
                .build();
    }

    @Transactional
    public GoalResponse toggleStatus(User me, Long goalId) {
        Goal goal = getOwnedGoal(me, goalId);
        goal.toggleComplete();
        return GoalResponse.from(goal);
    }

    @Transactional
    public void delete(User me, Long goalId) {
        Goal goal = getOwnedGoal(me, goalId);
        goalRepository.delete(goal);
    }

    private Goal getOwnedGoal(User me, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GOAL_NOT_FOUND", "목표를 찾을 수 없습니다."));

        if (!goal.getUser().getId().equals(me.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN, "GOAL_NOT_OWNED", "본인의 목표만 수정할 수 있습니다.");
        }

        return goal;
    }

    private User resolveTargetUser(User me, Long targetUserId) {
        if (targetUserId == null || targetUserId.equals(me.getId())) {
            return me;
        }

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));

        boolean isMate = mateRepository.findByUserAndMateAndStatus(me, target, MateStatus.CONNECTED).isPresent();

        if (!isMate) {
            throw new CustomException(HttpStatus.FORBIDDEN, "NOT_A_MATE", "연결된 메이트의 목표만 조회할 수 있습니다.");
        }

        return target;
    }
}

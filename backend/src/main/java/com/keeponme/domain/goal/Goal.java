package com.keeponme.domain.goal;

import com.keeponme.domain.user.User;
import com.keeponme.global.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@Table(name = "goals")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Goal extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private GoalType type;

    @Column(nullable = false, length = 200)
    private String title;

    /** 주간 목표(WEEKLY)의 경우 해당 주 월요일 날짜를 저장한다. */
    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    /** targetDate로부터 파생되는 요일. DAILY 목표의 요일별 조회/등록에 사용하며, WEEKLY 목표는 null. */
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", length = 10)
    private WeekDay dayOfWeek;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GoalStatus status;

    @Builder
    public Goal(User user, GoalType type, String title, LocalDate targetDate, WeekDay dayOfWeek, GoalStatus status) {
        this.user = user;
        this.type = type;
        this.title = title;
        this.targetDate = targetDate;
        this.dayOfWeek = dayOfWeek;
        this.status = status != null ? status : GoalStatus.PENDING;
    }

    public void toggleComplete() {
        this.status = (this.status == GoalStatus.PENDING) ? GoalStatus.COMPLETED : GoalStatus.PENDING;
    }

    public void markVerified() {
        this.status = GoalStatus.VERIFIED;
    }

    public void updateTitle(String title) {
        this.title = title;
    }
}

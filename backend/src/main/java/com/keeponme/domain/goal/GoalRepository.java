package com.keeponme.domain.goal;

import com.keeponme.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findAllByUserAndTypeAndTargetDate(User user, GoalType type, LocalDate targetDate);

    List<Goal> findAllByUserAndTargetDate(User user, LocalDate targetDate);
}

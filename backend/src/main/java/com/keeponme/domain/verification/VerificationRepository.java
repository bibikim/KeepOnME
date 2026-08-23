package com.keeponme.domain.verification;

import com.keeponme.domain.goal.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, Long> {

    Optional<Verification> findTopByGoalOrderByCreatedAtDesc(Goal goal);

    List<Verification> findAllByGoal(Goal goal);
}

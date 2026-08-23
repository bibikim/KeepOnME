package com.keeponme.domain.mate;

import com.keeponme.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MateRepository extends JpaRepository<Mate, Long> {

    List<Mate> findAllByUserAndStatus(User user, MateStatus status);

    Optional<Mate> findByUserAndMateAndStatus(User user, User mate, MateStatus status);

    Optional<Mate> findByUserAndMate(User user, User mate);
}

package com.keeponme.domain.poke;

import com.keeponme.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PokeRepository extends JpaRepository<Poke, Long> {

    List<Poke> findAllByReceiverOrderByCreatedAtDesc(User receiver);
}

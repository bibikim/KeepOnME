package com.keeponme.global.sse;

import com.keeponme.domain.poke.dto.PokeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SseEmitters sseEmitters;

    public void notifyPoke(Long receiverId, PokeResponse poke) {
        sseEmitters.sendTo(receiverId, "poke", poke);
    }
}

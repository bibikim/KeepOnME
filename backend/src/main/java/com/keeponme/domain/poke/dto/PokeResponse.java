package com.keeponme.domain.poke.dto;

import com.keeponme.domain.poke.Poke;

import java.time.LocalDateTime;

public record PokeResponse(
        Long id,
        Long senderId,
        String senderNickname,
        Long receiverId,
        String status,
        LocalDateTime createdAt
) {
    public static PokeResponse from(Poke poke) {
        return new PokeResponse(
                poke.getId(),
                poke.getSender().getId(),
                poke.getSender().getNickname(),
                poke.getReceiver().getId(),
                poke.getStatus().name(),
                poke.getCreatedAt()
        );
    }
}

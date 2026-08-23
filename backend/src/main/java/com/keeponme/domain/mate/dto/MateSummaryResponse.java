package com.keeponme.domain.mate.dto;

import com.keeponme.domain.mate.Mate;

public record MateSummaryResponse(
        Long id,
        Long mateUserId,
        String nickname,
        String status
) {
    public static MateSummaryResponse from(Mate mate) {
        return new MateSummaryResponse(
                mate.getId(),
                mate.getMate().getId(),
                mate.getMate().getNickname(),
                mate.getStatus().name()
        );
    }
}

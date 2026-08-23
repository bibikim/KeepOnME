package com.keeponme.domain.poke.dto;

import jakarta.validation.constraints.NotNull;

public record PokeSendRequest(
        @NotNull Long receiverId
) {
}

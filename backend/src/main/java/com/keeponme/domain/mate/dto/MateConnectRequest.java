package com.keeponme.domain.mate.dto;

import jakarta.validation.constraints.NotBlank;

public record MateConnectRequest(
        @NotBlank String inviteCode
) {
}

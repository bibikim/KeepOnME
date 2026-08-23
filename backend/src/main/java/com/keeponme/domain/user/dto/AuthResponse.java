package com.keeponme.domain.user.dto;

public record AuthResponse(
        String accessToken,
        UserResponse user
) {
}

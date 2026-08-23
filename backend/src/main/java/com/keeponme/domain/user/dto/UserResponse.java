package com.keeponme.domain.user.dto;

import com.keeponme.domain.user.User;

public record UserResponse(
        Long id,
        String email,
        String nickname,
        String inviteCode,
        String role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(), user.getEmail(), user.getNickname(), user.getInviteCode(), user.getRole().name());
    }
}

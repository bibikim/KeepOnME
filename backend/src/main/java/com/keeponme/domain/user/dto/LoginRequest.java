package com.keeponme.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
        // 일반 계정은 이메일 형식이어야 하지만, "admin" 계정만 예외로 허용한다.
        @NotBlank
        @Pattern(regexp = "^(admin|[^\\s@]+@[^\\s@]+\\.[^\\s@]+)$", message = "올바른 이메일 형식이 아닙니다.")
        String email,
        @NotBlank String password
) {
}

package com.keeponme.domain.user;

import com.keeponme.domain.user.dto.UserResponse;
import com.keeponme.global.jwt.AuthUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public UserResponse me(@AuthUser User user) {
        return UserResponse.from(user);
    }
}

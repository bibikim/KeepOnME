package com.keeponme.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;

/**
 * "admin" 계정이 없으면 앱 기동 시 1회 생성한다. 회원가입 API는 이메일 형식만
 * 허용하므로, 이 계정은 API를 거치지 않고 직접 시딩한다(로그인은 이메일 형식
 * 검증을 하지 않으므로 "admin" 아이디로 로그인 가능). 비밀번호는 매번 새로
 * 생성해 평문으로 저장하지 않고, 최초 생성 시 로그에만 한 번 노출한다.
 */
@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminAccountInitializer.class);
    private static final String ADMIN_LOGIN_ID = "admin";
    private static final String PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InviteCodeGenerator inviteCodeGenerator;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByEmail(ADMIN_LOGIN_ID)) {
            return;
        }

        String rawPassword = generatePassword();

        User admin = User.builder()
                .email(ADMIN_LOGIN_ID)
                .password(passwordEncoder.encode(rawPassword))
                .nickname("관리자")
                .inviteCode(inviteCodeGenerator.generate())
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);

        log.warn("""

                ============================================================
                 admin 계정이 새로 생성되었습니다. 로그인 후 반드시 비밀번호를 변경하세요.
                 로그인 아이디: {}
                 임시 비밀번호: {}
                ============================================================
                """, ADMIN_LOGIN_ID, rawPassword);
    }

    private String generatePassword() {
        StringBuilder sb = new StringBuilder(16);
        for (int i = 0; i < 16; i++) {
            sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}

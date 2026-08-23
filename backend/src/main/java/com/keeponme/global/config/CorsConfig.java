package com.keeponme.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security의 http.cors()가 사용하는 CorsConfigurationSource.
 * WebMvcConfigurer 방식 대신 이 방식을 쓰는 이유는 Security 필터 체인이
 * MVC 설정보다 먼저 요청을 가로채므로, 시큐리티 레벨에서 CORS를 등록해야
 * preflight(OPTIONS) 요청이 인증 필터 이전에 올바르게 처리되기 때문이다.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // localhost 외에 ngrok 등으로 외부 터널링해 모바일 등에서 접속 테스트할 때도
        // 허용되도록 ngrok 도메인 패턴을 포함한다.
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://*.ngrok-free.app",
                "https://*.ngrok-free.dev",
                "https://*.ngrok.app",
                "https://*.ngrok.io"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}

package com.keeponme.global.jwt;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 인증 필터가 SecurityContext에 설정한 사용자 ID를 컨트롤러 파라미터로 주입받기 위한 어노테이션.
 * {@code @AuthUser User user} 또는 {@code @AuthUser Long userId} 형태로 사용한다.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthUser {
}

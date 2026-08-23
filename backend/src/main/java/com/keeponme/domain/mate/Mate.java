package com.keeponme.domain.mate;

import com.keeponme.domain.user.User;
import com.keeponme.global.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 1:N 메이트 연결. 한 쌍이 연결되면 (user=A, mate=B)와 (user=B, mate=A) 두 레코드가
 * 각각 생성되어, "내 메이트 목록"을 항상 user_id 기준 단방향 조회로 가져올 수 있다.
 */
@Entity
@Getter
@Table(name = "mates", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "mate_id"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Mate extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mate_id", nullable = false)
    private User mate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MateStatus status;

    @Builder
    public Mate(User user, User mate, MateStatus status) {
        this.user = user;
        this.mate = mate;
        this.status = status != null ? status : MateStatus.CONNECTED;
    }
}

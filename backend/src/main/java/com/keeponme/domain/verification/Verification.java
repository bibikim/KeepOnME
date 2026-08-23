package com.keeponme.domain.verification;

import com.keeponme.domain.goal.Goal;
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
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "verifications")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Verification extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Lob
    @Column(name = "comment")
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false, length = 20)
    private ReviewStatus reviewStatus;

    @Column(name = "reject_reason", length = 255)
    private String rejectReason;

    @Builder
    public Verification(Goal goal, String imageUrl, String comment) {
        this.goal = goal;
        this.imageUrl = imageUrl;
        this.comment = comment;
        this.reviewStatus = ReviewStatus.PENDING;
    }

    public void approve(User reviewer) {
        this.reviewedBy = reviewer;
        this.reviewStatus = ReviewStatus.APPROVED;
    }

    public void reject(User reviewer, String reason) {
        this.reviewedBy = reviewer;
        this.reviewStatus = ReviewStatus.REJECTED;
        this.rejectReason = reason;
    }
}

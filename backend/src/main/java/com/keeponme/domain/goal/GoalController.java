package com.keeponme.domain.goal;

import com.keeponme.domain.goal.dto.GoalCreateRequest;
import com.keeponme.domain.goal.dto.GoalListResponse;
import com.keeponme.domain.goal.dto.GoalResponse;
import com.keeponme.domain.user.User;
import com.keeponme.global.jwt.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public GoalListResponse getGoals(
            @AuthUser User user,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate targetDate,
            @RequestParam(required = false) WeekDay dayOfWeek
    ) {
        return goalService.getGoals(user, userId, targetDate, dayOfWeek);
    }

    @PostMapping
    public ResponseEntity<GoalResponse> create(@AuthUser User user, @Valid @RequestBody GoalCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(user, request));
    }

    @PatchMapping("/{id}/status")
    public GoalResponse toggleStatus(@AuthUser User user, @PathVariable Long id) {
        return goalService.toggleStatus(user, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthUser User user, @PathVariable Long id) {
        goalService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}

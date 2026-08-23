package com.keeponme.domain.mate;

import com.keeponme.domain.mate.dto.MateConnectRequest;
import com.keeponme.domain.mate.dto.MateSummaryResponse;
import com.keeponme.domain.user.User;
import com.keeponme.global.jwt.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mates")
@RequiredArgsConstructor
public class MateController {

    private final MateService mateService;

    @GetMapping("/me")
    public List<MateSummaryResponse> getMyMates(@AuthUser User user) {
        return mateService.getMyMates(user);
    }

    @PostMapping("/connect")
    public ResponseEntity<MateSummaryResponse> connect(@AuthUser User user, @Valid @RequestBody MateConnectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mateService.connect(user, request.inviteCode()));
    }

    @DeleteMapping("/{mateId}")
    public ResponseEntity<Void> disconnect(@AuthUser User user, @PathVariable Long mateId) {
        mateService.disconnect(user, mateId);
        return ResponseEntity.noContent().build();
    }
}

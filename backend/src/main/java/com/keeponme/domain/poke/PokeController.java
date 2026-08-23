package com.keeponme.domain.poke;

import com.keeponme.domain.poke.dto.PokeResponse;
import com.keeponme.domain.poke.dto.PokeSendRequest;
import com.keeponme.domain.user.User;
import com.keeponme.global.jwt.AuthUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pokes")
@RequiredArgsConstructor
public class PokeController {

    private final PokeService pokeService;

    @PostMapping("/send")
    public ResponseEntity<PokeResponse> send(@AuthUser User user, @Valid @RequestBody PokeSendRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pokeService.send(user, request.receiverId()));
    }

    @GetMapping
    public List<PokeResponse> getMyPokes(@AuthUser User user) {
        return pokeService.getMyPokes(user);
    }

    @PatchMapping("/{id}/read")
    public PokeResponse markRead(@AuthUser User user, @PathVariable Long id) {
        return pokeService.markRead(user, id);
    }
}

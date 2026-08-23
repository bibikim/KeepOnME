package com.keeponme.domain.poke;

import com.keeponme.domain.mate.MateRepository;
import com.keeponme.domain.mate.MateStatus;
import com.keeponme.domain.poke.dto.PokeResponse;
import com.keeponme.domain.user.User;
import com.keeponme.domain.user.UserRepository;
import com.keeponme.global.error.CustomException;
import com.keeponme.global.sse.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PokeService {

    private final PokeRepository pokeRepository;
    private final UserRepository userRepository;
    private final MateRepository mateRepository;
    private final NotificationService notificationService;

    @Transactional
    public PokeResponse send(User me, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));

        boolean isMate = mateRepository.findByUserAndMateAndStatus(me, receiver, MateStatus.CONNECTED).isPresent();

        if (!isMate) {
            throw new CustomException(HttpStatus.FORBIDDEN, "NOT_A_MATE", "연결된 메이트에게만 찌르기를 보낼 수 있습니다.");
        }

        Poke poke = Poke.builder()
                .sender(me)
                .receiver(receiver)
                .build();

        pokeRepository.save(poke);

        PokeResponse response = PokeResponse.from(poke);
        notificationService.notifyPoke(receiver.getId(), response);

        return response;
    }

    public List<PokeResponse> getMyPokes(User me) {
        return pokeRepository.findAllByReceiverOrderByCreatedAtDesc(me).stream()
                .map(PokeResponse::from)
                .toList();
    }

    @Transactional
    public PokeResponse markRead(User me, Long pokeId) {
        Poke poke = pokeRepository.findById(pokeId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "POKE_NOT_FOUND", "찌르기 알림을 찾을 수 없습니다."));

        if (!poke.getReceiver().getId().equals(me.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN, "POKE_NOT_OWNED", "본인이 받은 찌르기만 읽음 처리할 수 있습니다.");
        }

        poke.markRead();
        return PokeResponse.from(poke);
    }
}

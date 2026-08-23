package com.keeponme.domain.mate;

import com.keeponme.domain.mate.dto.MateSummaryResponse;
import com.keeponme.domain.user.User;
import com.keeponme.domain.user.UserRepository;
import com.keeponme.global.error.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MateService {

    private final MateRepository mateRepository;
    private final UserRepository userRepository;

    public List<MateSummaryResponse> getMyMates(User me) {
        return mateRepository.findAllByUserAndStatus(me, MateStatus.CONNECTED).stream()
                .map(MateSummaryResponse::from)
                .toList();
    }

    @Transactional
    public MateSummaryResponse connect(User me, String inviteCode) {
        User target = userRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "INVITE_CODE_NOT_FOUND", "유효하지 않은 초대 코드입니다."));

        if (target.getId().equals(me.getId())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "SELF_CONNECT_NOT_ALLOWED", "자기 자신을 메이트로 연결할 수 없습니다.");
        }

        if (mateRepository.findByUserAndMateAndStatus(me, target, MateStatus.CONNECTED).isPresent()) {
            throw new CustomException(HttpStatus.CONFLICT, "ALREADY_CONNECTED", "이미 연결된 메이트입니다.");
        }

        Mate mine = Mate.builder().user(me).mate(target).status(MateStatus.CONNECTED).build();
        Mate theirs = Mate.builder().user(target).mate(me).status(MateStatus.CONNECTED).build();
        mateRepository.save(mine);
        mateRepository.save(theirs);

        return MateSummaryResponse.from(mine);
    }

    @Transactional
    public void disconnect(User me, Long mateRecordId) {
        Mate mine = mateRepository.findById(mateRecordId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "MATE_NOT_FOUND", "메이트 연결을 찾을 수 없습니다."));

        if (!mine.getUser().getId().equals(me.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN, "MATE_NOT_OWNED", "본인의 메이트 연결만 끊을 수 있습니다.");
        }

        User friend = mine.getMate();
        mateRepository.delete(mine);
        mateRepository.findByUserAndMate(friend, me).ifPresent(mateRepository::delete);
    }
}

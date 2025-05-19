const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname') as string;

/**
 * 채팅방 입장 요청 파라미터를 정의하는 인터페이스
 */
export interface JoinRoomParams {
    roomId: string;
    user_id: string;
    nickName?: string;
}

// ✅ DOMContentLoaded 이벤트로 HTML 로딩 완료 후 실행 보장
document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn') as Element;
    const inputRoomName = document.getElementById(
        'input-room-name',
    ) as HTMLInputElement;

    if (!enterBtn || !inputRoomName) {
        console.error('입장 버튼 또는 입력창이 없습니다.');
        return;
    }

    enterBtn.addEventListener('click', () => {
        const user_id = nickname;
        const roomId = inputRoomName.value.trim();

        if (!roomId) {
            alert('방 이름을 입력해주세요.');
            return;
        }

        // ✅ 안전한 방식으로 URL 이동
        window.location.href = `/src/pages/chat.html?roomId=${encodeURIComponent(roomId)}&user_id=${encodeURIComponent(user_id)}`;

        inputRoomName.value = '';
    });
});

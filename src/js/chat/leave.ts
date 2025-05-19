import { socket } from '../socket/socket';

const leaveBtn = document.querySelector('#leave-btn');

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('user_id') as string;

function leaveRoom(): void {
    socket.emit('leaveRoom');
}

// 게임 나가기
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/room.html?nickname=${encodeURIComponent(nickname)}`;
});

import { socket } from '../socket/socket';

const leaveBtn = document.querySelector('#leave-btn');

function leaveRoom(): void {
    socket.emit('leaveRoom');
}

// 게임 나가기
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/room.html`;
});

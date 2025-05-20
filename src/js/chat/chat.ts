import {
    joinRoom,
    leaveRoom,
    socket,
    type ChatMessage,
    type JoinRoomParams,
} from '../lib/yongchat';
import { getMyRole, startGame } from './start';

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const user_id = urlParams.get('user_id') as string;
const roomTitle = document.querySelector('#room-title') as HTMLElement;

if (roomId && roomTitle) {
    // roomTitle.textContent = `채팅방: ${roomName}`;

    const params: JoinRoomParams = {
        roomId,
        user_id,
        nickName: user_id,
    };

    const result = await joinRoom(params);
    console.log('채팅방 참여함:', result);
    if (result.ok) {
        roomTitle.textContent = `채팅방: ${result.roomInfo.roomName}`;

        // 게임 시작
        document.querySelector('#start-game')?.addEventListener('click', () => {
            // startGame();
            startGame(result.roomInfo.memberList);
        });
    } else {
        alert(result.message);
    }
} else {
    alert('방 정보가 없습니다.');
}

// 나가기 버튼 클릭
const leaveBtn = document.querySelector('#leave-btn');
// 게임 나가기
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/room.html?nickname=${encodeURIComponent(user_id)}`;
});

const roleDiv = document.querySelector('#my-role')!;

socket.on('message', (data: ChatMessage) => {
    console.log(data.msg);
    switch (data.msg.action) {
        case 'start':
            const myRole = getMyRole(data.msg.roles, user_id);
            if (myRole) {
                roleDiv.innerHTML = myRole;
            }

            break;
        case 'chat':
        case 'vote':
        case 'liveordie':

        case 'kill':
    }
});

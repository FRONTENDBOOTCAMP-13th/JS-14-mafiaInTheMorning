import {
    joinRoom,
    leaveRoom,
    socket,
    type ChatMessage,
    type JoinRoomParams,
    type Kill,
    type RoomMember,
    type RoomMembers,
} from '../lib/yongchat';
import { getMyRole, startGame } from './start';
import { renderPlayerList } from './renderplayer';

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const user_id = urlParams.get('user_id') as string;
const roomTitle = document.querySelector('#room-title') as HTMLElement;

if (roomId && roomTitle) {
    const params: JoinRoomParams = {
        roomId,
        user_id,
        nickName: user_id,
    };

    const result = await joinRoom(params);
    console.log('채팅방 참여함:', result);
    if (result.ok) {
        roomTitle.textContent = `채팅방: ${result.roomInfo.roomName}`;

        document.querySelector('#start-game')?.addEventListener('click', () => {
            startGame(result.roomInfo.memberList);
        });
    } else {
        alert(result.message);
    }
} else {
    alert('방 정보가 없습니다.');
}

const leaveBtn = document.querySelector('#leave-btn');
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/room.html?nickname=${encodeURIComponent(user_id)}`;
});

const roleDiv = document.querySelector('#my-role')!;

socket.on('message', (data: ChatMessage) => {
    console.log(data.msg);
    switch (data.msg.action) {
        case 'start': {
            const myRole = getMyRole(data.msg.roles, user_id);
            if (myRole) {
                roleDiv.innerHTML = myRole;
            }
            break;
        }
        case 'kill': {
            const killData = data.msg as Kill;
            if (killData.targetId === user_id) {
                alert('당신은 마피아에게 살해당했습니다.');
                roleDiv.innerHTML += '(사망)';
            } else {
                console.log(
                    `${killData.targetId} 님이 마피아에게 살해당했습니다.`,
                );
            }
            break;
        }
    }
});

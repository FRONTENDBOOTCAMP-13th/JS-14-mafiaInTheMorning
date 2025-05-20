import {
    joinRoom,
    leaveRoom,
    socket,
    sendMsg,
    type ChatMessage,
    type JoinRoomParams,
    type Kill,
    type RoomMember,
    type RoomMembers,
} from '../lib/yongchat';

import { getMyRole, startGame, hostStartBtn } from './start';
import { showText, msgInput, sendBtn, chat } from './chatting';
import { switchPhase } from '../time';

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
        //방장에게만 start버튼 보임
        hostStartBtn(result.roomInfo.hostName);

        const startButton = document.querySelector(
            '#start-game',
        ) as HTMLButtonElement;

        startButton?.addEventListener('click', () => {
            startGame(result.roomInfo.memberList);
            //타이머 시작
            switchPhase();
            //게임시작 후 시작버튼 비활성화
            startButton.disabled = true;
        });
    } else {
        alert(result.message);
    }
} else {
    alert('방 정보가 없습니다.');
}

// 메세지 전송
// 전송 버튼 클릭
sendBtn?.addEventListener('click', () => {
    // sendMsg(msgInput.value);
    chat(user_id);
    msgInput.value = '';
    msgInput.focus();
});
// 엔터 눌러도 전송가능하게
msgInput.addEventListener('keyup', (e: any) => {
    if (e.key === 'Enter') {
        // sendMsg(msgInput.value);

        chat(user_id);

        msgInput.value = '';
        msgInput.focus();
    }
});

// 나가기 버튼 클릭
const leaveBtn = document.querySelector('#leave-btn');
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/room.html?nickname=${encodeURIComponent(user_id)}`;
});

const roleDiv = document.querySelector('#my-role')!;

socket.on('message', (data: ChatMessage) => {
    console.log('받은 데이터', data.msg);
    switch (data.msg.action) {
        case 'start': {
            const myRole = getMyRole(data.msg.roles, user_id);
            if (myRole) {
                roleDiv.innerHTML = myRole;
            }
            switchPhase();

            break;
        }

        case 'chat':
            showText(data.msg);
            break;
        case 'vote':
        case 'liveordie':

        case 'kill':
    }
});

import {
    joinRoom,
    leaveRoom,
    socket,
    sendMsg,
    type ChatMessage,
    type JoinRoomParams,
    type RoomMember,
    type RoomMembers,
} from '../lib/yongchat';

import { getMyRole, startGame, hostStartBtn } from './start';
import { showText, msgInput, sendBtn, chat } from './chatting';
import { currentPhase, switchPhase } from '../time';
import { mafiaKill } from './kill';

// URL 파라미터 추출
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const user_id = urlParams.get('user_id') as string;

// DOM 요소
const roomTitle = document.querySelector('#room-title') as HTMLElement;
const roleDiv = document.querySelector('#my-role')!;
const leaveBtn = document.querySelector('#leave-btn');

// 채팅방 입장 로직
if (roomId && roomTitle) {
    const params: JoinRoomParams = {
        roomId,
        user_id,
        nickName: user_id,
    };

    const result = await joinRoom(params);
    console.log('채팅방 참여함:', result);

    if (result.ok) {
        // 방 이름 표시
        roomTitle.textContent = `채팅방: ${result.roomInfo.roomName}`;

        for (const member in result.roomInfo.memberList) {
            addUserToVoteUI(result.roomInfo.memberList[member]);
        }

        // 방장일 경우 시작 버튼 보이게
        hostStartBtn(result.roomInfo.hostName);

        const startButton = document.querySelector(
            '#start-game',
        ) as HTMLButtonElement;

        // 게임 시작 버튼 클릭 이벤트
        startButton?.addEventListener('click', () => {
            startGame(result.roomInfo.memberList);
            switchPhase();
            startButton.disabled = true;
        });
    } else {
        alert(result.message);
    }
} else {
    alert('방 정보가 없습니다.');
}

// 메시지 전송 - 버튼 클릭
sendBtn?.addEventListener('click', () => {
    chat(user_id);
    msgInput.value = '';
    msgInput.focus();
});

// 메시지 전송 - 엔터 입력
msgInput.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        chat(user_id);
        msgInput.value = '';
        msgInput.focus();
    }
});

// 나가기 버튼 클릭 시
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/room.html?nickname=${encodeURIComponent(user_id)}`;
});
let myRole = '';
// WebSocket 메시지 수신 처리
socket.on('message', (data: ChatMessage) => {
    console.log('받은 데이터', data.msg);

    switch (data.msg.action) {
        case 'start': {
            myRole = getMyRole(data.msg.roles, user_id) || '';
            if (myRole) {
                roleDiv.innerHTML = myRole;
                switchPhase('night');
            }

            break;
        }

        case 'chat':
            showText(data.msg);
            break;

        case 'vote':
        case 'liveordie':
        case 'kill': {
            const { targetId } = data.msg as {
                targetId: string;
                from: string;
            };
            console.log(`${targetId}이(가) 죽었습니다.`);

            break;
        }
    }
});
/**
 * 채팅방 멤버 목록 수신 이벤트 리스너
 * @description 현재 참여 중인 채팅방의 멤버 목록이 업데이트될 때 호출됩니다.
 * @param members - 현재 채팅방의 모든 멤버 정보를 담고 있는 객체
 */
socket.on('members', (members: RoomMembers) => {
    console.log('새로운 사용자 입장.', members);
    const container = document.querySelector('#profiles');
    if (!container) return;

    container.innerHTML = '';
    for (const member in members) {
        addUserToVoteUI(members[member]);
    }
});

// 추가 유저 UI
function addUserToVoteUI(user: RoomMember) {
    console.log(user);
    const container = document.querySelector('#profiles');
    if (!container) return;

    // const existing = document.querySelector(`#user-${user.user_id}`);
    // if (existing) return; // 중복 방지

    const div = document.createElement('div');
    div.dataset.userid = user.nickName;
    div.className = `
        w-[180px] h-[100px]
        flex flex-col items-center justify-center
        bg-blue-100 hover:bg-blue-200 transition-colors
        rounded-xl shadow cursor-pointer 

    `;
    div.innerHTML = `
        <div class="text-lg font-semibold text-gray-800">${user.nickName}</div>
    `;

    // 클릭 이벤트로 투표 및 마피아 기능
    div.addEventListener('click', () => {
        console.log(`${user_id}클릭`, div.dataset.userid);

        // myRole을 전역 변수로 선언하여 case 'start'에서 할당하고 여기서 사용
        if (currentPhase === 'night' && myRole === '마피아') {
            mafiaKill(user_id, div.dataset.userid!);
        }
    });

    container.appendChild(div);
}

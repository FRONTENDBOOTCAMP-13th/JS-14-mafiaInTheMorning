import '../../style.css';
import {
    getRoomInfo,
    joinRoom,
    leaveRoom,
    socket,
    type ChatMessage,
    type JoinRoomParams,
    type RoomMember,
    type RoomMembers,
} from '../lib/yongchat';
import { getMyRole, startGame, hostStartBtn } from './start';
import { showText, msgInput, sendBtn, chat, chatArea } from './chatting';
import {
    lodHide,
    lodShow,
    lodChoice,
    lodChoices,
    lodArr,
    lodResult,
} from './liveordie';

import {
    currentPhase,
    getCanAct,
    getVotePhase,
    setCanAct,
    switchPhase,
} from '../time';
import { mafiaKill } from './kill';

import {
    getLiveOrDiePlayer,
    getLivePlayerCount,
    getPlayerList,
    setPlayerList,
} from '../lib/store';


import { dayVote } from './vote';

// URL 파라미터 추출
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId')!;
const user_id = urlParams.get('user_id') as string;
let hostInfo = '';
// DOM 요소
const roomTitle = document.querySelector('#room-title') as HTMLElement;
const roleDiv = document.querySelector('#my-role')!;
let myRole = '';
let members: { [key: string]: any } = {};

// 채팅방 입장 로직
if (roomId && roomTitle) {
    const params: JoinRoomParams = {
        roomId,
        user_id,
        nickName: user_id,
    };

    const result = await joinRoom(params);
    hostInfo = result.roomInfo.hostName;
    localStorage.setItem('hostInfo', hostInfo);
    console.log('채팅방 참여함:', result);

    if (result.ok) {
        // 방 이름 표시
        roomTitle.textContent = `채팅방: ${result.roomInfo.roomName}`;

        for (const member in result.roomInfo.memberList) {
            addUserToVoteUI(result.roomInfo.memberList[member]);
        }

        // 방장일 경우 시작 버튼 보이게
        hostStartBtn(result.roomInfo.hostName);
    } else {
        alert(result.message);
    }
} else {
    alert('방 정보가 없습니다.');
}

const startButton = document.querySelector('#start-game') as HTMLButtonElement;

// 게임 시작 버튼 클릭 이벤트
startButton?.addEventListener('click', async () => {
    const roomInfo = await getRoomInfo(roomId);
    startGame(roomInfo.memberList);
    // switchPhase();
    socket.on('message', (data: ChatMessage) => {
        switch (data.msg.action) {
            case 'start':
                for (const member in members as any) {
                    addUserToVoteUI(members[member]);
                }
                break;
        }
    });

    startButton.disabled = true;
});

// 메시지 전송 - 버튼 클릭
sendBtn?.addEventListener('click', () => {
    const myPlayer = getPlayerList()[user_id];
    if (myPlayer.killed) {
        alert('당신은 사망하셨습니다.');
        return;
    }
    if (currentPhase === 'night' && myRole === '마피아') {
        chat(user_id);
    } else if (currentPhase === 'day') {
        chat(user_id);
    }

    msgInput.value = '';
    msgInput.focus();
});

// 메시지 전송 - 엔터 입력
msgInput.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        // sendMsg(msgInput.value);
        const myPlayer = getPlayerList()[user_id];
        if (myPlayer.killed) {
            alert('당신은 사망하셨습니다.');
            return;
        }
        console.log('챗 보내기', currentPhase, myRole);
        if (currentPhase === 'night' && myRole === '마피아') {
            console.log('night chat');
            chat(user_id);
        } else if (currentPhase === 'day') {
            console.log('day chat');
            chat(user_id);
        }
        msgInput.value = '';
        msgInput.focus();
    }
});

// live or die

let choice = true;
let trueCnt = 0;
document.querySelector('#lod-btn')?.addEventListener('click', () => {
    lodShow();
});
document.querySelector('#kill')?.addEventListener('click', () => {
    const myPlayer = getPlayerList()[user_id];
    if (myPlayer.killed) {
        alert('죽은 사람이 어딜 !');
        return;
    }

    lodHide();
    choice = true;
    lodChoice(choice);
});
document.querySelector('#save')?.addEventListener('click', () => {
    const myPlayer = getPlayerList()[user_id];
    if (myPlayer.killed) {
        alert('죽은 사람이 어딜 !');
        return;
    }

    lodHide();
    choice = false;
    lodChoice(choice);
});

// 나가기 버튼 클릭
const leaveBtn = document.querySelector('#leave-btn');
// 게임 나가기
leaveBtn?.addEventListener('click', () => {
    leaveRoom();
    window.location.href = `/src/pages/chatlist-page.html?nickname=${encodeURIComponent(user_id)}`;
});
// let myRole = '';
// WebSocket 메시지 수신 처리
socket.on('message', async (data: ChatMessage) => {
    console.log('받은 데이터', data.msg);
    switch (data.msg.action) {
        case 'start': {
            myRole = getMyRole(data.msg.roles, user_id) || '';
            if (myRole) {
                roleDiv.innerHTML = myRole;
                const timerContainer =
                    document.getElementById('timer-container');
                if (timerContainer) {
                    timerContainer.classList.remove('hidden');
                    timerContainer.classList.add('flex');
                }
                switchPhase('night');
                // 밤이 시작되면 채팅 비활성화 (마피아는 예외)
            }

            const roomInfo = await getRoomInfo(roomId);

            for (const playerId in roomInfo.memberList) {
                const player = roomInfo.memberList[playerId];
                const playerRole = data.msg.roles.find(
                    role => role.user_id === playerId,
                );
                if (playerRole) {
                    player.role = playerRole.role;
                    player.vote = 0;
                    player.killed = false; // 생존여부
                }
            }

            setPlayerList(roomInfo.memberList);

            console.log('playerList', getPlayerList());

            break;
        }

        case 'chat':
            if (currentPhase === 'day') showText(data.msg);
            else if (currentPhase === 'night' && myRole === '마피아') {
                showText(data.msg);
            }
            break;

        case 'vote':
            break;
        case 'liveordie':
            let target = getLiveOrDiePlayer().nickName;
            lodChoices(data.msg, lodArr);
            console.log(lodArr);
            console.log(lodArr.length);
            let livePlayer = getLivePlayerCount();
            if (livePlayer == lodArr.length) {
                trueCnt = lodResult(lodArr, trueCnt);
                if (trueCnt > Math.floor(livePlayer / 2)) {
                    // 죽이기
                    mafiaKill('시민들(이)', target);
                    lodArr.length = 0;
                } else {
                    // 살리기
                    const p = document.createElement('p');
                    p.innerText = `${target}님이 죽지 않았습니다.`;
                    chatArea?.appendChild(p);

                    lodArr.length = 0;
                }
            }
            console.log(trueCnt);

            break;
        // 아직 구현 전
        case 'kill':
            {
                const { targetId } = data.msg as {
                    targetId: string;
                    from: string;
                };
                console.log(`${targetId}이(가) 죽었습니다.`);

                // playerList에서 해당 유저 상태 업데이트
                const updatedList = getPlayerList();
                if (updatedList[targetId]) {
                    updatedList[targetId].killed = true;
                    setPlayerList(updatedList);
                }

                // UI 랜더링
                const container = document.querySelector('#profiles');
                if (container) {
                    container.innerHTML = ''; // 기존 유저 UI 삭제
                    for (const playerId in updatedList) {
                        addUserToVoteUI(updatedList[playerId]); // 유저 업데이트된 UI 함수를 작성하면 됨
                    }
                }
            }
            break;
        case 'phaseShift': {
            console.log(`${data.msg.phase}이 되었습니다.`);
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
    console.log('user:: ', user);
    const container = document.querySelector('#profiles');
    if (!container) return;

    // const existing = document.querySelector(`#user-${user.user_id}`);
    // if (existing) return; // 중복 방지

    let profileImage = '/src/assets/player.svg';

    if (user.nickName === user_id && myRole) {
        if (myRole === '마피아') {
            profileImage = '/src/assets/mafia.svg';
        } else if (myRole === '경찰') {
            profileImage = '/src/assets/police.svg';
        } else if (myRole === '의사') {
            profileImage = '/src/assets/doctor.svg';
        } else if (myRole === '시민') {
            profileImage = '/src/assets/citizen.svg';
        }
    } else {
        profileImage = '/src/assets/player.svg';
    }

    // const profileImage = document.createElement('img');
    // profileImage.dataset.userid = user.user_id;

    const div = document.createElement('div');
    div.dataset.userid = user.nickName;
    div.className = `
        w-[130px] h-[180px]
        flex flex-col items-center justify-center
        bg-gray-800 hover:bg-red-700 transition-colors
        rounded-xl shadow cursor-pointer
        p-2
    `;

    div.innerHTML = `
    <div style="position: relative; width: 108px; height: 108px; margin-bottom: 0.25rem; margin-top: 0.5rem;"> 
        <img
            src="${profileImage}"
            alt="유저 프로필"
            class="w-[108px] h-[108px] object-cover rounded-full"
        />
        ${user.killed ? `<img src="/src/assets/vote.svg" alt="죽음 표시" style="position: absolute; top: 0; left: 0; width: 130px; height: 130px; pointer-events: none; opacity: 0.85;" />` : ''}
        <div class="text-center text-lg mt-1 font-semibold ${
            user.killed ? 'text-red-500' : 'text-gray-200'
        }">
            ${user.nickName}
        </div>
    `;
    // 클릭 이벤트로 투표 및 마피아 기능
    div.addEventListener('click', () => {
        if (!getCanAct()) {
            alert('이미 행동하셨습니다.');
            return;
        }
        const myPlayer = getPlayerList()[user_id];
        if (myPlayer.killed) {
            alert('죽은 사람이 어케 투표해~');
            return;
        }
        console.log(`${user_id}클릭`, div.dataset.userid);

        const targetId = div.dataset.userid!;
        // 밤에 마피아만 행동 가능
        if (currentPhase === 'night' && myRole !== '마피아') {
            alert('밤에는 행동할 수 없습니다.');
            return;
        }

        // myRole을 전역 변수로 선언하여 case 'start'에서 할당하고 여기서 사용
        if (currentPhase === 'night' && myRole === '마피아') {
            // 마피아 자기 자신 선택 금지
            if (myRole === '마피아' && div.dataset.userid === user_id) {
                alert('자기 자신은 선택할 수 없습니다.');
                return;
            }
            mafiaKill(user_id, targetId);
        } else if (currentPhase === 'day') {
            // 낮일 때 지목 투표 시간에만 허용
            if (!getVotePhase()) {
                alert('지금은 지목 투표 시간이 아닙니다.');
                return;
            }
            dayVote(user_id, targetId);
        }

        setCanAct(false);
    });

    container.appendChild(div);
}

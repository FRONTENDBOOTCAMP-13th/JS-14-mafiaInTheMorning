import '../../style.css';
// import playerImage from '../../../src/assets/player9.png';
// import mafiaImage from '../../../src/assets/mafia.svg';
// import doctorImage from '../../../src/assets/doctor.svg';
// import policeImage from '../../../src/assets/police.svg';
// import citizenImage from '../../../src/assets/citizen.svg';
// import voteImage from '../../../src/assets/vote.svg';
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
import { showText, msgInput, sendBtn, chat } from './chatting';
import {
    lodHide,
    lodShow,
    lodChoice,
    lodChoices,
    lodArr,
    lodResult,
    lodClose,
    liveOrDieDiv,
} from './liveordie';

import {
    currentPhase,
    getCanAct,
    getVotePhase,
    setCanAct,
    switchPhase,
} from '../time';
import { citizenKill, mafiaKill } from './kill';

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
export const user_id = urlParams.get('user_id') as string;
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
    }
});

// live or die

let choice = true;
let trueCnt = 0;
document.querySelector('#lod-btn')?.addEventListener('click', () => {
    if (currentPhase === 'night') {
        alert('지금은 찬반투표 시간이 아닙니다.');
    }
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

// live or die 창 닫기
lodClose?.addEventListener('click', () => {
    liveOrDieDiv?.classList.add('hidden');
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

            // ⬇ 역할이 반영된 UI 다시 렌더링
            const container = document.querySelector('#profiles');
            if (container) {
                container.innerHTML = '';
                const updatedList = getPlayerList();
                for (const playerId in updatedList) {
                    addUserToVoteUI(updatedList[playerId]);
                }
            }

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
            let target = getLiveOrDiePlayer().user_id;
            console.log('target값', target);
            lodChoices(data.msg, lodArr);
            console.log('투표들', lodArr);
            console.log('투표수', lodArr.length);
            let livePlayer = getLivePlayerCount();
            if (livePlayer == lodArr.length) {
                trueCnt = lodResult(lodArr, trueCnt);
                console.log('찬성수', trueCnt);
                if (trueCnt > Math.floor(livePlayer / 2)) {
                    // 죽이기
                    citizenKill(target);
                    lodArr.length = 0;
                } else {
                    // 살리기
                    showText({
                        action: 'chat',
                        nickname: '사회자',
                        msg: ` ${target}님이 살았습니다.`,
                    });

                    lodArr.length = 0;
                }
            }

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
                    const updatedList = getPlayerList();
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

    let profileImage = '/player9.png';

    if (user.nickName === user_id && myRole) {
        if (myRole === '마피아') {
            profileImage = '/mafia.svg';
        } else if (myRole === '경찰') {
            profileImage = '/police.svg';
        } else if (myRole === '의사') {
            profileImage = '/doctor.svg';
        } else if (myRole === '시민') {
            profileImage = '/citizen.svg';
        }
    } else {
        profileImage = '/player9.png';
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
            class="w-[108px] h-[108px] object-cover rounded-full mt-[-14px]"
        />
        ${user.killed ? `<img src="/vote.svg" alt="죽음 표시" style="position: absolute; top: -21px; left: 0; width: 150px; height: 150px; pointer-events: none; opacity: 0.85;" />` : ''}
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

        // 경찰 기능
        if (currentPhase === 'night' && myRole === '경찰') {
            // 밤이고 경찰이여야함
            if (targetId === user_id) {
                // 자기자신 조사 막기
                alert('자기 자신은 조사할 수 없습니다.');
                return;
            }

            const playerList = getPlayerList();
            const targetPlayer = playerList[targetId];

            if (!targetPlayer) {
                // 게임 플레이어가 아니면 막기
                alert('조사할 수 없는 대상입니다.');
                return;
            }
            if (targetPlayer.killed === true) {
                alert('죽은 사람 조사해서 뭐해 !');
                return;
            }
            if (targetPlayer.role === '마피아') {
                // 마피아 분별
                alert(`${targetId}님은 마피아다.`);
            } else {
                alert(`${targetId}님은 마피아가 아님.`);
            }

            setCanAct(false); // 밤마다 한번씩만 행동하도록
            return;
        }
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
            alert(`당신은 ${targetId}님에게 투표하셨습니다.`);
            dayVote(user_id, targetId);
        }

        setCanAct(false);
    });

    container.appendChild(div);
}

import {
    sendMsg,
    type Role,
    type RoomMembers,
    type StartGame,
} from '../lib/yongchat';
import { assignRoles } from '../random-role';

// 시작 버튼 가져오기
const startButton = document.getElementById('start-game') as HTMLButtonElement;

// URL에서 user_id 가져오기
function getUserIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('user_id');
}

// 시작 버튼 보이기 조건 (방장만 보이게 & 활성화)
export function hostStartBtn(hostName: string) {
    const userId = getUserIdFromURL();

    if (!userId || userId !== hostName) {
        if (startButton) {
            startButton.style.display = 'none';
            startButton.disabled = true;
        }
    } else {
        if (startButton) {
            startButton.style.display = 'block';
            startButton.disabled = false;
        }
    }
}

//역할 랜덤 분배
export function startGame(memberList: RoomMembers) {
    const randomRoles = assignRoles(Object.keys(memberList).length);
    const roles: Role[] = Object.keys(memberList).map((user_id, i) => {
        console.log(user_id);
        return {
            user_id,
            role: randomRoles[i],
        };
    });

    const msg: StartGame = {
        action: 'start',
        roles,
        phase: 'night',
    };
    sendMsg(msg);
}

export function getMyRole(roles: Role[], user_id: string) {
    return roles.find(role => role.user_id === user_id)?.role;
}

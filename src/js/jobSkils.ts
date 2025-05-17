import {
    players,
    gameDay,
    setGameDay,
    setCanKill,
    canKill,
    canFind,
    setCanFind,
} from './SkilsTestState';
import { mafiaKill } from './mafiaSkils';
const list = document.getElementById('player-list');
const myId = 'user1'; // 가정을 위한 나의 상태

// 플레이어 목록 랜더링 하는 함수
export function renderPlayers() {
    console.log('랜더링 성공');
    if (!list) {
        return;
    }
    list.innerHTML = ''; // 리스트 초기화

    const myJob = players.find(p => p.id === myId);
    if (!myJob) {
        return;
    }
    // players 배열에 추가되는 내용을 최신화 하는 함수
    players.forEach((p, index) => {
        const li = document.createElement('li');
        li.textContent = `${p.name} (${p.role})`;
        list.appendChild(li);

        if (!p.alive) {
            li.classList.add('dead');
        }

        li.addEventListener('click', () => {
            if (myJob.role === 'mafia' && gameDay === 'night' && canKill) {
                mafiaKill(index);
            } else if (
                myJob.role === 'police' &&
                gameDay === 'night' &&
                canFind
            ) {
                const isMafia = p.role === 'mafia';
                alert(
                    `${p.name}은 ${isMafia ? '마피아임' : '마피아가 아닙니다.'}`,
                );
                setCanFind(false);
            } else if (myJob.role === 'doctor' && gameDay === 'night') {
                alert('의사기능 구현해야함');
            }
        });
    });
}

renderPlayers();

// 밤이 시작되면 마피아, 경찰, 의사의 능력이 가능하도록 구현
function startNight() {
    if (gameDay === 'night') {
        setCanKill(true);
        setCanFind(true);
        renderPlayers();
    }
}

// 낮밤 전환 버튼
const btn = document.querySelector('#changeTimeBtn');
btn?.addEventListener('click', () => {
    if (gameDay !== 'night') {
        setGameDay('night');
        alert('밤이 되었습니다.');
        startNight();
    } else {
        setGameDay('morning');
        alert('낮이 되었습니다.');
    }
    console.log('낮 밤이 전환되었습니다.');
    renderPlayers();
});

btn?.classList.add('cursor-pointer');
// 나의 상태 변경
const mafiaBtn = document.querySelector('#mafiaBtn');
const policeBtn = document.querySelector('#policeBtn');
const healerBtn = document.querySelector('#healerBtn');
function changeRole(newRole: string) {
    const player = players.find(p => p.id === 'user1');
    if (player) {
        player.role = newRole;
        alert(`${newRole} 전직 성공! \n현재 역할: ${player.role}`);
        renderPlayers();
    } else {
        console.error('user1을 찾을 수 없습니다.');
    }
}

mafiaBtn?.addEventListener('click', () => changeRole('mafia'));
policeBtn?.addEventListener('click', () => changeRole('police'));
healerBtn?.addEventListener('click', () => changeRole('doctor'));

import '../style.css';

const players = [
    { id: 'user1', name: '나', role: 'mafia', alive: true },
    { id: 'user2', name: '유저1', role: 'citizen', alive: true },
    { id: 'user3', name: '유저2', role: 'citizen', alive: true },
    { id: 'user4', name: '유저3', role: 'citizen', alive: true },
    { id: 'user5', name: '유저4', role: 'citizen', alive: true },
    { id: 'user6', name: '유저5', role: 'citizen', alive: true },
    { id: 'user7', name: '유저6', role: 'citizen', alive: true },
    { id: 'user8', name: '유저7', role: 'citizen', alive: true },
];

//  낮밤 설정을 위한 가정
let gameDay = 'night';
let canKill = true;
// 플레이어 리스트 구현
const list = document.getElementById('player-list');

list.innerHTML = ''; // list의 초기화

// 플레이어 리스트 렌더링 함수
function renderPlayers() {
    list.innerHTML = ''; // 리스트 다시 초기화
    players.forEach((p, index) => {
        const li = document.createElement('li');
        li.textContent = `${p.name} (${p.role})`;
        if (!p.alive) {
            li.classList.add('dead');
        }
        // 밤일 때만 클릭 이벤트 활성화
        if (gameDay === 'night' && canKill) {
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
                mafiaKill(index);
            });
        }
        list.appendChild(li);
    });
}
// 마피아의 기능 구현
function mafiaKill(targetIndex: number) {
    const target = players[targetIndex];

    // 이미 죽은 사람은 클릭 불가능
    if (!target.alive) {
        alert(`이미 죽은 사람을 또 죽이다니 당신은 잔인해`);
        return;
    }

    // 마피아가 자기 자신을 죽이려고 하면 막기
    const mafia = players.find(p => p.role === 'mafia');
    if (target.id === mafia?.id) {
        alert('자결은 안돼');
        return;
    }

    // 마피아의 킬
    target.alive = false;
    alert(`${target.name}을 죽였습니다.`);
    canKill = false;
    gameDay = 'morning';
    console.log('낮이 되었습니다.');
    renderPlayers();
}

// 밤이 되면 한번만 킬 할수 있게 하는 방법
function startNight() {
    if (gameDay === 'night') {
        canKill = true;
        renderPlayers();
    }
}
renderPlayers();

// 낮밤 전환 버튼
const btn = document.querySelector('button');
btn?.addEventListener('click', () => {
    if (gameDay !== 'night') {
        gameDay = 'night';
        console.log('밤이 되었습니다.');
        startNight();
    } else {
        gameDay = 'morning';
        console.log('낮이 되었습니다.');
    }
    console.log('낮 밤이 전환되었습니다.');
    renderPlayers();
});

import { players, setCanKill } from './SkilsTestState';
import { renderPlayers } from './jobSkils';

export function mafiaKill(targetIndex: number) {
    console.log('마피아의 시간');
    const target = players[targetIndex];

    if (!target.alive) {
        alert(`이미 죽은 사람을 또 죽이다니 당신은 잔인해`);
        return;
    }

    const mafia = players.find(p => p.role === 'mafia');
    if (target.id === mafia?.id) {
        alert('자결은 안돼');
        return;
    }

    target.alive = false;
    alert(`${target.name}을 죽였습니다.`);

    setCanKill(false);
    renderPlayers();
}

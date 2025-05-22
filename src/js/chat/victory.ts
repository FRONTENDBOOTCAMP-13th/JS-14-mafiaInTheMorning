import { getPlayerList } from '../lib/store';
import { showText } from './chatting';

// 게임 승리 조건을 판단하고, 승리 시 메세지 출력
export function checkGameEnd() {
    const playerList = getPlayerList(); // 전체 플레이어 정보

    const alivePlayers = Object.values(playerList).filter(p => !p.killed); // 플레이어 정보 중 살아있는 상태인 사람만 필터
    const aliveMafia = alivePlayers.filter(p => p.role === '마피아');
    const aliveCitizens = alivePlayers.filter(p => p.role !== '마피아');

    if (aliveMafia.length === 0) {
        showText({
            action: 'chat',
            nickname: '사회자',
            msg: `모든 마피아를 처리했습니다 시민 승입니다.`,
        });
        console.log('게임종료');
        return true;
    }

    if (aliveMafia.length >= aliveCitizens.length) {
        showText({
            action: 'chat',
            nickname: '사회자',
            msg: `마피아가 모든 시민들을 처리했습니다.`,
        });
        console.log('게임종료');
        return true;
    }

    return false; // 아직 끝나지 않음
}

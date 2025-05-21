/**
 * @fileoverview 마피아 게임의 낮 투표 시스템
 * 게임 진행 중 낮 시간에 마피아로 의심되는 플레이어를 투표하는 기능을 구현
 *
 * 주요 기능:
 * - 낮 시간에만 투표 가능
 * - 모든 생존 플레이어가 한 번씩 투표
 * - 과반수 이상 득표시 해당 플레이어 처형 여부 결정
 * - 동률일 경우 처형하지 않음
 */

import {
    getPlayerList,
    initVote,
    setLiveOrDiePlayer,
    setPlayerList,
} from '../lib/store';
import { sendMsg, socket, type ChatMessage } from '../lib/yongchat';
import { showText } from './chatting';

/**
 * 플레이어가 다른 플레이어에게 투표하는 함수
 * @param {string} from - 투표를 행사하는 플레이어의 ID
 * @param {string} targetId - 투표 대상이 되는 플레이어의 ID
 */
export function dayVote(from: string, targetId: string) {
    sendMsg({
        action: 'vote',
        from,
        targetId,
    });
}

/**
 * WebSocket 메시지 수신 이벤트 핸들러
 * 투표 관련 메시지를 받으면 해당 투표를 처리
 */
socket.on('message', (data: ChatMessage) => {
    switch (data.msg.action) {
        case 'vote':
            addVote(data.msg.targetId);
            break;
    }
});

/**
 * 투표를 처리하고 결과를 계산하는 함수
 * @param {string} targetId - 투표 대상 플레이어의 ID
 */
function addVote(targetId: string) {
    // 현재 게임의 전체 플레이어 목록 조회
    const playerList = getPlayerList();

    // 투표 대상 플레이어의 득표수 증가
    playerList[targetId].vote++;

    // 전체 투표수 계산을 위한 변수 초기화
    let totalVote = 0;
    const playerCount = Object.keys(playerList).length;

    // 모든 플레이어의 득표수를 합산
    for (const playerId in playerList) {
        const player = playerList[playerId];
        totalVote += player.vote || 0;
    }

    // 변경된 플레이어 정보를 저장소에 업데이트
    setPlayerList(playerList);

    // 투표 진행 상황 로깅
    console.log('득표', targetId);
    console.log('현재까지 투표수', totalVote);
    console.log('목표 투표수', playerCount);

    // 모든 플레이어가 투표를 완료했는지 확인
    if (totalVote === playerCount) {
        console.log('투표 종료', playerList);

        // 최다 득표수 계산
        const maxVote = Math.max(
            ...Object.values(playerList).map(player => player.vote),
        );

        // 과반수 이상 득표 여부 확인
        if (maxVote >= playerCount / 2) {
            // 최다 득표자 목록 추출
            const maxVotePlayers = Object.values(playerList).filter(
                player => player.vote === maxVote,
            );

            // 최다 득표자가 한 명인 경우 (동률이 아닌 경우)
            if (maxVotePlayers.length === 1) {
                // 해당 플레이어를 처형 대상으로 지정
                setLiveOrDiePlayer(maxVotePlayers[0]);
                // 처형 대상자 발표
                showText({
                    action: 'chat',
                    nickname: '사회자',
                    msg: `${maxVotePlayers[0].nickName}님이 총 ${maxVote}표를 받아서 사형대에 올랐습니다. 찬반 투표를 진행해 주세요`,
                });
            }
        }

        // 투표 상태 초기화
        initVote();
    }
}

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
 * 투표를 처리하는 함수
 * @param {string} targetId - 투표 대상 플레이어 ID
 */
function addVote(targetId: string) {
    const playerList = getPlayerList();

    if (!playerList[targetId]) return;

    playerList[targetId].vote = (playerList[targetId].vote || 0) + 1;

    setPlayerList(playerList);

    console.log('득표', targetId);
}

// 나의 유저 ID (현재 로그인된 유저가 user1라고 가정함) - 자기 가진을 투표할 수 없도록
const USER_ID = 'user1';

const HIDE_CLASSES = ['invisible', 'opacity-0']; //숨기기
const SHOW_CLASSES = ['visible', 'opacity-100']; //보이기

// 현재 선택된 대상 유저ID 저장
let selectedUserId: string | null = null;

// 모든 프로필 요소 선택
const profileElements = document.querySelectorAll<HTMLElement>('.profile');

profileElements.forEach(profile => {
    //모든 유저 프로필에 설정된 data-user 가져오기
    const targetUserId = profile.dataset.user;

    // 유저 id가 자기 자신이면 클릭 이벤트 적용 안됨
    if (!targetUserId || targetUserId === USER_ID) return;

    profile.addEventListener('click', () => {
        // 프로필 안에 있는 .vote-icon 선택
        const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
        if (!voteIcon) return;

        // 이미 선택된 유저를 다시 클릭하면 → 투표 취소
        if (selectedUserId === targetUserId) {
            voteIcon.classList.remove(...SHOW_CLASSES); //아이콘 숨기기
            voteIcon.classList.add(...HIDE_CLASSES); //아이콘 숨김
            selectedUserId = null; //선택 상태 초기화
            // console.log('투표 취소');
            return;
        }

        // 다른 유저가 이미 선택되어 있으면 그 유저 아이콘 숨기기(중복 안되도록)
        if (selectedUserId) {
            // 이전에 선택한 유저 프로필 아이콘 찾기
            const prevIcon = document.querySelector<HTMLElement>(
                `.profile[data-user="${selectedUserId}"] .vote-icon`,
            );
            prevIcon?.classList.remove(...SHOW_CLASSES); //보이던 아이콘 숨김 처리
            prevIcon?.classList.add(...HIDE_CLASSES);
        }

        // 현재 클릭한 유저의 아이콘 표시
        voteIcon.classList.remove(...HIDE_CLASSES); //숨기기 제거 - 현재 클릭한 유저의 아이콘을 보이게함
        voteIcon.classList.add(...SHOW_CLASSES); //보이기 클래스 추가
        selectedUserId = targetUserId; //현재 선택된 유저 id 갱신
        // console.log('투표 대상:', selectedUserId);
    });
});

// 최다 득표자 처리 함수
export function handleVoteResult() {
    const playerList = getPlayerList(); // 플레이어 리스트를 가져옴
    const playerCount = Object.keys(playerList).length; // 살아있는 플레이어의 수를 체크

    // 최다 득표수 계산
    const maxVote = Math.max(
        ...Object.values(playerList).map(player => player.vote || 0),
    );

    if (maxVote >= playerCount / 2) {
        const maxVotePlayers = Object.values(playerList).filter(
            player => (player.vote || 0) === maxVote,
        );

        if (maxVotePlayers.length === 1) {
            // 단일 최다 득표자만 있을 경우
            setLiveOrDiePlayer(maxVotePlayers[0]);
            console.log('최다 득표자', maxVotePlayers[0]);
            showText({
                action: 'chat',
                nickname: '사회자',
                msg: `${maxVotePlayers[0].nickName}님이 총 ${maxVote}표를 받아서 사형대에 올랐습니다. 찬반 투표를 진행해 주세요`,
            });
        } else {
            // 동률일 경우 처형 없음
            showText({
                action: 'chat',
                nickname: '사회자',
                msg: `투표 결과 동률이 발생하여 처형 대상자가 없습니다.`,
            });
        }
    } else {
        showText({
            action: 'chat',
            nickname: '사회자',
            msg: `과반수 득표자가 없어 처형 대상자가 없습니다.`,
        });
    }

    initVote(); // 다음 투표를 위해 초기화
}

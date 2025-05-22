import { getLiveOrDiePlayer } from '../lib/store';
import { type LiveOrDie, sendMsg, socket } from '../lib/yongchat';

export const liveOrDieDiv = document.querySelector('#live-or-die');
export const lodQ = document.querySelector('#wantKill') as any;
const votePlayerElem = document.querySelector('#votePlayer') as HTMLElement;
export const lodClose = document.querySelector('#lodClose');

export let lodArr: boolean[] = [];

export function lodHide() {
    if (liveOrDieDiv) liveOrDieDiv.classList.add('hidden');
}
export function lodShow() {
    const target = getLiveOrDiePlayer();
    votePlayerElem.innerHTML = target.nickName;
    if (liveOrDieDiv) liveOrDieDiv.classList.remove('hidden');
}

export function showQuestion(member: string) {
    lodQ.innerText = `${member}님이 마피아로 지목당했습니다. 죽이길 동의하십니까?`;
}
// 서버 발송
export function lodChoice(yesorno: boolean) {
    const msg: LiveOrDie = {
        action: 'liveordie',
        choice: yesorno,
    };
    sendMsg(msg);
}

// 선택들을 배열에 담기
export function lodChoices(data: LiveOrDie, arr: Array<boolean>) {
    arr.push(data.choice);
}

// 찬성표 세기
export function lodResult(arr: Array<boolean>, cnt: number) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === true) {
            cnt = cnt + 1;
        }
    }
    return cnt;
}

// 투표 끝나는 시점

// WebSocket 메시지 수신 처리
socket.on('message', (data: LiveOrDie) => {
    switch (data.action) {
        case 'liveordie':
            console.log(data.choice);
            let target = getLiveOrDiePlayer().user_id;
            lodChoices(data.msg, lodArr);
            console.log('투표들', lodArr);
            console.log('투표수', lodArr.length);
            let livePlayer = getLivePlayerCount();
            if (livePlayer == lodArr.length) {
                trueCnt = lodResult(lodArr, trueCnt);
                console.log('찬성수', trueCnt);
                if (trueCnt > Math.floor(livePlayer / 2)) {
                    // 죽이기

                    killPlayer(target);
                    showText({
                        action: 'chat',
                        nickname: '사회자',
                        msg: ` ${target}님이 죽었습니다.`,
                    });
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
    }
});

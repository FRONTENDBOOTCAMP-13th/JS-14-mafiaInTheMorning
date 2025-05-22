import { killPlayer } from '../lib/store';
import { sendMsg, socket, type ChatMessage } from '../lib/yongchat';
import { showText } from './chatting';
export let isMafiaKilled = false;

export function mafiaKill(user_id: string, targetId: string) {
    if (isMafiaKilled) {
        alert('이미 마피아가 킬을 했습니다.');
        return; // 두 번째 킬 시도 차단
    }
    // console.log(`${user_id}가  ${targetId}을 죽임`);
    sendMsg({
        action: 'kill',
        targetId: targetId,
        from: user_id,
    });
}

export function citizenKill(targetId: string) {
    sendMsg({
        action: 'citizenkill',
        targetId: targetId,
    });
}
// // WebSocket 메시지 수신 처리
// socket.on('message', (data: Kill) => {
//     switch (data.action) {
//         case 'kill':
//             console.log(data.targetId);
//             killPlayer(data.targetId);
//             break;
//     }
// });

// webSocket 메시지 수신 처리 죽임을 당하면 killed = true가 되도록
socket.on('message', (packet: ChatMessage) => {
    if (packet.msg.action === 'kill') {
        console.log(packet);
        const data = packet.msg;
        // 유저에게 알림
        isMafiaKilled = true;
        killPlayer(data.targetId);
        showText({
            action: 'chat',
            nickname: '사회자',
            msg: `마피아가 뒷통수를 내리쳐 ${data.targetId} 유저를 죽였습니다.`,
        });
    } else if (packet.msg.action === 'citizenkill') {
        console.log(packet);
        const data = packet.msg;
        // 유저에게 알림
        killPlayer(data.targetId);
        showText({
            action: 'chat',
            nickname: '사회자',
            msg: `투표에 의해 ${data.targetId} 유저가 죽였습니다.`,
        });
    }
});

export function resetMafiaKill() {
    isMafiaKilled = false;
}

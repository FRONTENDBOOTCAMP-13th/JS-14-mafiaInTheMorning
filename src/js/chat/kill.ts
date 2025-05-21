import { killPlayer } from '../lib/store';
import {
    sendMsg,
    socket,
    type ChatMessage,
    type Kill,
    type LiveOrDie,
} from '../lib/yongchat';
import { showText } from './chatting';

export function mafiaKill(user_id: string, targetId: string) {
    console.log(`${user_id}가  ${targetId}을 죽임`);
    sendMsg({
        action: 'kill',
        targetId: targetId,
        from: user_id,
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
        const data = packet.msg as Kill;
        // 유저에게 알림
        showText({
            action: 'chat',
            nickname: '사회자',
            msg: `마피아가 뒷통수를 내리쳐 ${data.targetId} 유저를 죽였습니다.`,
        });
        killPlayer(data.targetId);
    }
});

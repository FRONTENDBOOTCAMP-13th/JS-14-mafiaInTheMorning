import { sendMsg } from '../lib/yongchat';

export function mafiaKill(user_id: string, targetId: string) {
    console.log(`${user_id}가  ${targetId}을 죽임`);
    sendMsg({
        action: 'kill',
        targetId: targetId,
        from: user_id,
    });
}

import { type Chat, sendMsg } from '../lib/yongchat';
import { switchPhase } from '../time';
// import { gameDay, setGameDay } from '../SkilsTestState';

export let msgInput = document.querySelector('#msg-input') as any;
export const sendBtn = document.querySelector('#send-btn');
export const chatArea = document.querySelector('#chat-area');

// 서버 발신
export function chat(id: string) {
    const msg: Chat = {
        action: 'chat',
        nickname: id,
        msg: msgInput.value,
    };
    sendMsg(msg);
}

switchPhase('day');

// 수신
export function showText(data: Chat) {
    // if (gameDay === 'morning') {
    const p = document.createElement('p');
    p.innerText = `${data.nickname} :  ${data.msg}`;
    chatArea?.appendChild(p);

    if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
    // }
}

import { type Chat, sendMsg } from '../lib/yongchat';

export let msgInput = document.querySelector('#msg-input') as any;
export const sendBtn = document.querySelector('#send-btn');
export const chatArea = document.querySelector('#chat-area');

export function chat(id: string) {
    const msg: Chat = {
        action: 'chat',
        nickname: id,
        msg: msgInput.value,
    };
    sendMsg(msg);
}

export function showText(data: Chat) {
    const p = document.createElement('p');
    // console.log(data.nickname)
    p.innerText = `${data.nickname} :  ${data.msg}`;
    console.log('채팅 영역', chatArea);
    chatArea?.appendChild(p);
}

import { sendMsg } from '../lib/yongchat';

let msgInput = document.querySelector('#msg-input') as any;
const sendBtn = document.querySelector('#send-btn');
const chatArea = document.querySelector('#chat-area');

// 전송 버튼 클릭
sendBtn?.addEventListener('click', () => {
    sendMsg(msgInput.value);
    msgInput.value = '';
    msgInput.focus();
});

// 엔터 눌러도 전송가능하게
msgInput.addEventListener('keyup', (e: any) => {
    if (e.key === 'Enter') {
        sendMsg(msgInput.value);
        msgInput.value = '';
        msgInput.focus();
    }
});

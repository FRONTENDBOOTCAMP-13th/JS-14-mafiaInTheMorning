import { socket } from '../socket';

let msgInput = document.querySelector('#msg-input') as any;
const sendBtn = document.querySelector('#send-btn');
const chatArea = document.querySelector('#chat-area');

socket.on('message', (data: ChatMessage) => {
    // console.log(`${data.nickName}: ${data.msg}`);
    const p = document.createElement('p');
    p.innerText = `${data.nickName}: ${data.msg}`;
    chatArea?.appendChild(p);
});

interface ChatMessage {
    nickName: string;
    msg: string;
}

// 메세지 보내기
function sendMsg(msg: string): void {
    if (msg.trim()) {
        socket.emit('message', msg);
    }
}

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

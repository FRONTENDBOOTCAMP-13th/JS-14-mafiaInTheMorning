export const socket = io('ws://fesp-api.koyeb.app/febc13-chat');

let msgInput = document.querySelector('#msg-input') as any;
const sendBtn = document.querySelector('#send-btn');

// 메세지 보내기
function sendMsg(msg: string): void {
    if (msg.trim()) {
        socket.emit('message', msg);
    }
}

// 서버에 연결
socket.on('connect', () => {
    console.log('connect with server!');
});

// 전송 버튼 클릭
sendBtn?.addEventListener('click', () => {
    sendMsg(msgInput.value);
    msgInput.value = '';
    msgInput.focus();
});

// 엔터 치면 전송되게하는 함수
msgInput.addEventListener('keyup', (e: any) => {
    if (e.key === 'Enter') {
        sendMsg(msgInput.value);
        msgInput.value = '';
        msgInput.focus();
    }
});

import { socket } from './send.js';

export interface ChatMessage {
    nickName: string;
    msg: string;
}

// const talkingArea = document.querySelector('#talking-area');

window.addEventListener('pagehide', () => {
    localStorage.setItem('history', JSON.stringify(chatHistory));
});

const chatHistory: ChatMessage[] = JSON.parse(
    localStorage.getItem('history') || '[]',
);
console.log(chatHistory);

socket.on('message', (data: ChatMessage) => {
    chatHistory.push(data);
    console.log(data.msg);
});

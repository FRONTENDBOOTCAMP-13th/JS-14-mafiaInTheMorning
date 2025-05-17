import { socket } from '../socket';

export interface ChatMessage {
    nickName: string;
    msg: string;
}

window.addEventListener('pagehide', () => {
    localStorage.setItem('history', JSON.stringify(chatHistory));
});

const chatHistory: ChatMessage[] = JSON.parse(
    localStorage.getItem('history') || '[]',
);
console.log(chatHistory);

socket.on('message', (data: ChatMessage) => {
    chatHistory.push(data);
});

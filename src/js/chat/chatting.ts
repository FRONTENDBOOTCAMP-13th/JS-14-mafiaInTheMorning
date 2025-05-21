import { type Chat, sendMsg } from '../lib/yongchat';
import { switchPhase } from '../time';

export let msgInput = document.querySelector('#msg-input') as HTMLInputElement;
export const sendBtn = document.querySelector('#send-btn') as any;
export const chatArea = document.querySelector('#chat-area');

// 서버 발신
export function chat(id: string) {
    msgInput.dataset.userId = id; // 내 닉네임 저장
    const msg: Chat = {
        action: 'chat',
        nickname: id,
        msg: msgInput.value,
    };
    sendMsg(msg);
    msgInput.value = ''; // 입력창 비우기
}

// Phase 초기 설정
switchPhase('day');

// 수신
export function showText(data: Chat) {
    const p = document.createElement('p');
    p.innerText = `${data.nickname} :  ${data.msg}`;
    chatArea?.appendChild(p);
    p.innerText = data.msg;

    const isMine = data.nickname === msgInput?.dataset.userId;
    const isHost = data.nickname === '사회자';

    p.className = `
        mb-1 px-4 py-2 max-w-[70%] break-words text-sm
        ${
            isHost
                ? 'bg-[#5D010A] font-bold text-white self-start rounded-2xl rounded-bl-none mr-auto'
                : isMine
                  ? 'bg-[#4A5056] text-white self-end rounded-2xl rounded-br-none ml-auto text-right'
                  : 'bg-gray-200 text-black self-start rounded-2xl rounded-bl-none mr-auto text-left'
        }
    `.trim();

    // 닉네임 태그 추가
    const nickname = document.createElement('span');
    nickname.innerText = data.nickname;
    nickname.className = `text-white mb-1 text-s font-semibold ${isMine ? 'text-right ml-auto text-white md-1' : 'text-left mr-auto'} ${isHost ? 'text-yellow-400' : ''}`;

    // 닉네임과 말풍선 함께 감싸는 div 생성
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col';
    wrapper.appendChild(nickname);
    wrapper.appendChild(p);

    chatArea?.appendChild(wrapper);
    // 스크롤 맨 아래로
    if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

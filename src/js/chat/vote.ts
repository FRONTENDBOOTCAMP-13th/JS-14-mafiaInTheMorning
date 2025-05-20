// 낮에 투표 마피아 찾기
// 낮에 모두 투표함
// 1. 닉네임을 화면에 띄우기
// 2. 클릭하면 투표됨 - 낮에만 투표 가능, 밤에 투표하면 안된다고 경고창 or 클릭 안됨
// 죽으면 투표 못 함
// 죽은 유저들의 정보는???

import { sendMsg, socket, type ChatMessage, type Vote } from '../lib/yongchat'; //가져오기

export function dayVote(data: Vote) {
    sendMsg(data);
}

// WebSocket 메시지 수신 처리
socket.on('message', (data: ChatMessage) => {
    console.log('받은 데이터', data.msg);

    switch (data.msg.action) {
        case 'vote':
            break;
    }
});

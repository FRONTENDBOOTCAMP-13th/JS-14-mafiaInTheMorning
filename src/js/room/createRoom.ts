import { type CreateRoomParams, createRoom } from '../lib/yongchat';

import '/src/style.css'; // tailwind 사용

const createRoomBtn = document.querySelector('#create-room-btn');
const modal = document.querySelector('#modal') as Element;
const createBtn = document.querySelector('#create-btn');
const cancelBtn = document.querySelector('#cancel-btn');

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname') as string;

export const roomName = document.querySelector('#room-name') as any;
// const persons = document.querySelector('#persons') as any;

// 방 만들기 버튼
createRoomBtn?.addEventListener('click', () => {
    modal.classList.toggle('hidden');
});

// 생성 버튼
createBtn?.addEventListener('click', async e => {
    e.preventDefault();

    if (!roomName.value) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
        const params: CreateRoomParams = {
            // roomId: roomName.value,
            user_id: nickname,
            roomName: roomName.value,
            hostName: nickname,
            autoclose: true,
            // persons: persons.value,
        };
        const result = await createRoom(params);
        console.log('생성방 생성 요청 결과', result);
        window.location.reload();
    }
});

// 취소버튼
cancelBtn?.addEventListener('click', e => {
    e.preventDefault();
    modal.classList.toggle('hidden');
});

// import io from 'socket.io-client';
import { socket } from '../socket';

import '/src/style.css'; // tailwind 사용

const createRoomBtn = document.querySelector('#create-room-btn');
const modal = document.querySelector('#modal') as Element;
const createBtn = document.querySelector('#create-btn');
const cancelBtn = document.querySelector('#cancel-btn');

export const roomName = document.querySelector('#room-name') as any;
// const persons = document.querySelector('#persons') as any;
const alert = document.querySelector('.alert') as any;

/**
 * 채팅방 멤버의 정보를 정의하는 인터페이스
 */
interface RoomMember {
    user_id: string;
    nickName: string;
}
/**
 * 채팅방의 멤버 목록을 정의하는 인터페이스
 * @description 채팅방의 모든 멤버 정보를 담고 있는 객체 타입입니다.
 * 키는 user_id를, 값은 RoomMember 타입의 멤버 정보를 가집니다.
 */
interface RoomMembers {
    // [key: string]: 타입 스크립트의 타입 정의 방법중 하나인 index signature
    // 속성명을 명시하지 않고 속성명의 타입과 속성값의 타입을 정의
    // 인터페이스에 정의할 여러 속성들이 동일한 타입을 가지고 있을 때 모든 속성을 기술하지 않고 인덱스 시그니처 하나로 정의 가능
    // "key"라는 문자 대신 아무 문자나 사용 가능
    // 속성명의 타입은 string, number, symbol만 사용 가능
    [key: string]: RoomMember;
}
/**
 * 채팅방의 전체 정보를 정의하는 인터페이스
 */
interface RoomInfo {
    roomId: string;
    user_id: string;
    hostName: string;
    roomName: string;
    parents_option: any;
    memberList: RoomMembers;
    // persons: number;
}
/**
 * 채팅방 생성 요청 파라미터를 정의하는 인터페이스
 */
interface CreateRoomParams {
    roomId?: string; // 생략 시 자동으로 랜덤 문자열 생성
    user_id: string;
    roomName: string;
    hostName: string;
    // persons: number;
}

/**
 * 채팅방 생성 응답을 정의하는 인터페이스
 */
interface CreateRoomResponse {
    success: boolean;
    roomList: { [key: string]: RoomInfo };
}

// 새로운 방 생성 함수
function createRoom(params: CreateRoomParams): Promise<CreateRoomResponse> {
    if (!params.user_id.trim()) {
        throw new Error('user_id가 없습니다.');
    }
    if (!params.roomName.trim()) {
        throw new Error('roomName이 없습니다.');
    }
    return new Promise(resolve => {
        socket.emit('createRoom', params, (res: CreateRoomResponse) => {
            resolve(res);
        });
    });
}

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
        const user_id = 'adminId';
        const hostName = 'host';
        const params: CreateRoomParams = {
            roomId: roomName.value,
            user_id,
            roomName: roomName.value,
            hostName,
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

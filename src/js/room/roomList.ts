// import io from 'socket.io-client';
import { socket } from '../socket';

const roomList = document.querySelector('#room-list');

export interface RoomMember {
    user_id: string;
    nickName: string;
}

/**
 * 채팅방의 멤버 목록을 정의하는 인터페이스
 * @description 채팅방의 모든 멤버 정보를 담고 있는 객체 타입입니다.
 * 키는 user_id를, 값은 RoomMember 타입의 멤버 정보를 가집니다.
 */
export interface RoomMembers {
    // [key: string]: 타입 스크립트의 타입 정의 방법중 하나인 index signature
    // 속성명을 명시하지 않고 속성명의 타입과 속성값의 타입을 정의
    // 인터페이스에 정의할 여러 속성들이 동일한 타입을 가지고 있을 때 모든 속성을 기술하지 않고 인덱스 시그니처 하나로 정의 가능
    // "key"라는 문자 대신 아무 문자나 사용 가능
    // 속성명의 타입은 string, number, symbol만 사용 가능
    [key: string]: RoomMember;
}

export interface RoomsResponse {
    [key: string]: RoomInfo;
}

export interface RoomInfo {
    roomId: string;
    user_id: string;
    hostName: string;
    roomName: string;
    parents_option: any;
    memberList: RoomMembers;
}

interface CreateRoomResponse {
    success: boolean;
    roomList: { [key: string]: RoomInfo };
}

function getRooms(): Promise<RoomsResponse> {
    return new Promise(resolve => {
        socket.emit('rooms', (rooms: RoomsResponse) => {
            resolve(rooms);
        });
    });
}

socket.on('connect', () => {
    console.log('서버와 연결됨');
    socket.emit('rooms', (rooms: RoomsResponse) => {
        console.log('전체 채팅방 목록:', rooms);
        for (const key in rooms) {
            const li = document.createElement('li');
            li.textContent = rooms[key].roomName;
            roomList?.appendChild(li);
        }
    });
});

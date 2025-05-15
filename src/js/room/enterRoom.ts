// import io from 'socket.io-client';
// const socket = io('ws://fesp-api.koyeb.app/febc13-chat/team01');

const enterBtn = document.querySelector('#enter-btn');

enterBtn?.addEventListener('click', e => {
    // TODO 채팅방 입장 함수 호출
    console.log(e);
});

// /**
//  * 채팅방 멤버의 정보를 정의하는 인터페이스
//  */
// interface RoomMember {
//     user_id: string;
//     nickName: string;
// }

// /**
//  * 채팅방의 멤버 목록을 정의하는 인터페이스
//  * @description 채팅방의 모든 멤버 정보를 담고 있는 객체 타입입니다.
//  * 키는 user_id를, 값은 RoomMember 타입의 멤버 정보를 가집니다.
//  */
// interface RoomMembers {
//     // [key: string]: 타입 스크립트의 타입 정의 방법중 하나인 index signature
//     // 속성명을 명시하지 않고 속성명의 타입과 속성값의 타입을 정의
//     // 인터페이스에 정의할 여러 속성들이 동일한 타입을 가지고 있을 때 모든 속성을 기술하지 않고 인덱스 시그니처 하나로 정의 가능
//     // "key"라는 문자 대신 아무 문자나 사용 가능
//     // 속성명의 타입은 string, number, symbol만 사용 가능
//     [key: string]: RoomMember;
// }

// /**
//  * 채팅방의 전체 정보를 정의하는 인터페이스
//  */
// interface RoomInfo {
//     roomId: string;
//     user_id: string;
//     hostName: string;
//     roomName: string;
//     parents_option: any;
//     memberList: RoomMembers;
// }

// /**
//  * 채팅방 입장 요청 파라미터를 정의하는 인터페이스
//  */
// interface JoinRoomParams {
//     roomId: string;
//     user_id: string;
//     nickName?: string;
// }

// /**
//  * 채팅방 입장 응답을 정의하는 인터페이스
//  */
// interface JoinRoomResponse {
//     ok: number;
//     message: string;
//     roomInfo: RoomInfo;
// }

// function joinRoom(params: JoinRoomParams): Promise<JoinRoomResponse> {
//     if (!params.roomId.trim()) {
//         throw new Error('roomId가 없습니다.');
//     }
//     if (!params.user_id.trim()) {
//         throw new Error('user_id가 없습니다.');
//     }
//     return new Promise(resolve => {
//         socket.emit('joinRoom', params, (res: JoinRoomResponse) => {
//             resolve(res);
//         });
//     });
// }

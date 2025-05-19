// import { openVoteModal } from './modal';

// 나의 유저 ID (현재 로그인된 유저가 user1라고 가정함) - 자기 가진을 투표할 수 없도록
const USER_ID = 'user1';

const HIDE_CLASSES = ['invisible', 'opacity-0']; //숨기기
const SHOW_CLASSES = ['visible', 'opacity-100']; //보이기

// 현재 선택된 대상 유저ID 저장
let selectedUserId: string | null = null;

// 모든 프로필 요소 선택
const profileElements = document.querySelectorAll<HTMLElement>('.profile');

profileElements.forEach(profile => {
    //모든 유저 프로필에 설정된 data-user 가져오기
    const targetUserId = profile.dataset.user;

    // 유저 id가 자기 자신이면 클릭 이벤트 적용 안됨
    if (!targetUserId || targetUserId === USER_ID) return;

    profile.addEventListener('click', () => {
        // 프로필 안에 있는 .vote-icon 선택
        const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
        if (!voteIcon) return;

        // 이미 선택된 유저를 다시 클릭하면 → 투표 취소
        if (selectedUserId === targetUserId) {
            voteIcon.classList.remove(...SHOW_CLASSES); //아이콘 숨기기
            voteIcon.classList.add(...HIDE_CLASSES); //아이콘 숨김
            selectedUserId = null; //선택 상태 초기화
            // console.log('투표 취소');
            return;
        }

        // 다른 유저가 이미 선택되어 있으면 그 유저 아이콘 숨기기(중복 안되도록)
        if (selectedUserId) {
            // 이전에 선택한 유저 프로필 아이콘 찾기
            const prevIcon = document.querySelector<HTMLElement>(
                `.profile[data-user="${selectedUserId}"] .vote-icon`,
            );
            prevIcon?.classList.remove(...SHOW_CLASSES); //보이던 아이콘 숨김 처리
            prevIcon?.classList.add(...HIDE_CLASSES);
        }

        // 현재 클릭한 유저의 아이콘 표시
        voteIcon.classList.remove(...HIDE_CLASSES); //숨기기 제거 - 현재 클릭한 유저의 아이콘을 보이게함
        voteIcon.classList.add(...SHOW_CLASSES); //보이기 클래스 추가
        selectedUserId = targetUserId; //현재 선택된 유저 id 갱신
        // console.log('투표 대상:', selectedUserId);
    });
});

// import { socket } from './socket/socket';

// interface RoomMember {
//     user_id: string;
//     nickName: string;
// }

// interface RoomMembers {
//     [key: string]: RoomMember;
// }

// interface RoomInfo {
//     roomId: string;
//     user_id: string;
//     hostName: string;
//     roomName: string;
//     parents_option: any;
//     memberList: RoomMembers;
// }

// function createUserProfile(member: RoomMember) {
//     const container = document.createElement('div');
//     container.className =
//         'profile relative grid place-items-center cursor-pointer';
//     container.dataset.user = member.user_id;

//     container.innerHTML = `
//         <img
//             src="/src/assets/player.svg"
//             alt="${member.nickName}"
//             class="w-40 h-40 object-cover rounded-xs shadow-md"
//         />
//         <div
//             class="vote-icon invisible opacity-0 absolute inset-0 place-items-center justify-center items-center transition-opacity duration-300"
//         >
//             <img
//                 src="/src/assets/vote.svg"
//                 alt="투표 아이콘"
//                 class="w-30 h-30 mt-3"
//             />
//         </div>
//         <div
//             class="absolute bottom-0 w-33 bg-black bg-opacity-60 rounded-2xl text-white text-center text-sm py-1 mb-2"
//         >
//             ${member.nickName}
//         </div>
//     `;

//     // 클릭 시 투표 소켓 전송
//     container.addEventListener('click', () => {
//         socket.emit('vote', member.user_id); // 서버와 협의된 이벤트명으로 바꿔야 함
//     });

//     return container;
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const voteList = document.getElementById('vote-list');
//     const roomInfoString = sessionStorage.getItem('roomInfo'); // 서버에서 받아온 RoomInfo 저장된 값
//     if (!roomInfoString || !voteList) return;

//     const roomInfo: RoomInfo = JSON.parse(roomInfoString);

//     Object.values(roomInfo.memberList).forEach(member => {
//         const profileEl = createUserProfile(member);
//         voteList.appendChild(profileEl);
//     });
// });

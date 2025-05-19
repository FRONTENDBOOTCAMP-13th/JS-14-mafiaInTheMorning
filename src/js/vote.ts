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
// import type { JoinRoomParams } from './room/enterRoom';

// // URL 파라미터에서 정보 추출
// const urlParams = new URLSearchParams(window.location.search);
// const roomId = urlParams.get('roomId') as string;
// const user_id = urlParams.get('user_id') as string;
// const nickname = user_id;

// // 유저 프로필 이미지 매핑(예시)
// const userImg = (_userId: string) => '/src/assets/player.svg';

// // 서버에서 유저 목록 받아와서 vote-list에 렌더링
// function renderVoteList(memberList: {
//     [key: string]: { user_id: string; nickName: string };
// }) {
//     const voteList = document.getElementById('vote-list');
//     if (!voteList) return;
//     voteList.innerHTML = '';
//     Object.values(memberList).forEach(member => {
//         const profile = document.createElement('div');
//         profile.className = 'profile relative grid place-items-center';
//         profile.dataset.user = member.user_id;
//         profile.innerHTML = `
//       <img src="${userImg(member.user_id)}" alt="${member.nickName}" class="w-40 h-40 object-cover rounded-xs shadow-md" />
//       <div class="vote-icon invisible opacity-0 absolute inset-0 justify-center items-center transition-opacity duration-300">
//         <img src="/src/assets/vote.svg" alt="투표 아이콘" class="w-30 h-30" />
//       </div>
//       <div class="absolute bottom-0 w-33 bg-black bg-opacity-60 rounded-2xl text-white text-center text-sm py-1 mb-2">
//         ${member.user_id === user_id ? '나' : member.nickName}
//       </div>
//     `;
//         voteList.appendChild(profile);
//     });
// }

// // 방 입장 및 유저 목록 받아오기
// function joinRoom(params: JoinRoomParams): Promise<any> {
//     return new Promise(resolve => {
//         socket.emit('joinRoom', params, (res: any) => {
//             resolve(res);
//         });
//     });
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     if (!roomId || !user_id) {
//         alert('방 정보가 없습니다.');
//         return;
//     }
//     const params: JoinRoomParams = {
//         roomId,
//         user_id,
//         nickName: nickname,
//     };
//     const result = await joinRoom(params);
//     if (result && result.roomInfo && result.roomInfo.memberList) {
//         renderVoteList(result.roomInfo.memberList);
//     }
// });

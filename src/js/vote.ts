// 나의 유저 ID (현재 로그인된 유저가 user1라고 가정함)
const VOTER_ID = 'user1';

const HIDE_CLASSES = ['invisible', 'opacity-0'];
const SHOW_CLASSES = ['visible', 'opacity-100'];

// 현재 선택된 대상 ID
let selectedUserId: string | null = null;

// 모든 프로필 요소 선택
const profileElements = document.querySelectorAll<HTMLElement>('.profile');

profileElements.forEach(profile => {
    const targetUserId = profile.dataset.user;

    // 자기 자신은 클릭 대상 아님
    if (!targetUserId || targetUserId === VOTER_ID) return;

    profile.addEventListener('click', () => {
        const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
        if (!voteIcon) return;

        // 이미 선택된 대상을 클릭한 경우 → 취소
        if (selectedUserId === targetUserId) {
            voteIcon.classList.remove(...SHOW_CLASSES);
            voteIcon.classList.add(...HIDE_CLASSES);
            selectedUserId = null;
            console.log('투표 취소');
            return;
        }

        // 이전 선택된 투표 아이콘 숨기기
        if (selectedUserId) {
            const prevIcon = document.querySelector<HTMLElement>(
                `.profile[data-user="${selectedUserId}"] .vote-icon`,
            );
            prevIcon?.classList.remove(...SHOW_CLASSES);
            prevIcon?.classList.add(...HIDE_CLASSES);
        }

        // 새로운 대상에 투표 표시
        voteIcon.classList.remove(...HIDE_CLASSES);
        voteIcon.classList.add(...SHOW_CLASSES);
        selectedUserId = targetUserId;
        console.log('투표 대상:', selectedUserId);
    });
});

// // // 투표한 유저 ID (null이면 투표 안 한 상태)
// // let votedTargetUserId: string | null = null;

// // // 현재 유저 ID (로그인한 사용자로 가정)
// // const userId = '1';

// // // 모든 프로필 요소 선택
// // const profiles = document.querySelectorAll<HTMLElement>('.profile');

// // profiles.forEach(profile => {
// //     profile.addEventListener('click', () => {
// //         const targetUserId = profile.dataset.user;
// //         const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
// //         if (!targetUserId || !voteIcon) return;

// //         // 자기 자신 투표 못하도록 설정
// //         if (targetUserId === userId) {
// //             alert('자기 자신에게는 투표할 수 없습니다.');
// //             return;
// //         }

// //         // 이미 투표한 대상이면 취소
// //         if (votedTargetUserId === targetUserId) {
// //             voteIcon.classList.add('hidden'); //투표 아이콘 다시 숨기기
// //             voteIcon.classList.remove('flex'); //보인 상태 해제
// //             votedTargetUserId = null; //아무한테도 투표 안 한 상태로 복귀
// //             return;
// //         }

// //         // 다른 유저를 이미 투표한 경우 -> 이전 투표 아이콘 제거 (재투표 가능)
// //         if (votedTargetUserId !== null) {
// //             //투표 했는지 확인
// //             const prevProfile = document.querySelector<HTMLElement>( //이전에 투표한 프로필 다시 찾음
// //                 `.profile[data-user="${votedTargetUserId}"]`, //투표 아이콘 다시 가져옴
// //             );
// //             const prevIcon =
// //                 prevProfile?.querySelector<HTMLElement>('.vote-icon');
// //             prevIcon?.classList.add('hidden'); //기존 투표 아이콘 제거
// //             prevIcon?.classList.remove('flex');
// //         }

// //         // 새로 클린한 유저에 투표 아이콘 표시
// //         voteIcon.classList.remove('hidden'); //현재 클릭한 유저에게 투표 표시
// //         voteIcon.classList.add('flex');
// //         votedTargetUserId = targetUserId;
// //     });
// // });

// // 나의 유저 ID (현재 로그인된 유저)
// const VOTER_ID = 'user1';

// // Tailwind 클래스 변수화
// const HIDE_CLASSES = ['invisible', 'opacity-0'];
// const SHOW_CLASSES = ['visible', 'opacity-100'];

// // 현재 선택된 대상 ID
// let selectedUserId: string | null = null;

// // 모든 프로필 요소 선택
// const profileElements = document.querySelectorAll<HTMLElement>('.profile');

// profileElements.forEach(profile => {
//     const targetUserId = profile.dataset.user;

//     // 자기 자신은 클릭 대상 아님
//     if (!targetUserId || targetUserId === VOTER_ID) return;

//     profile.addEventListener('click', () => {
//         const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
//         if (!voteIcon) return;

//         // 이미 선택된 대상을 클릭한 경우 → 취소
//         if (selectedUserId === targetUserId) {
//             voteIcon.classList.remove(...SHOW_CLASSES);
//             voteIcon.classList.add(...HIDE_CLASSES);
//             selectedUserId = null;
//             console.log('투표 취소');
//             return;
//         }

//         // 이전 선택된 투표 아이콘 숨기기
//         if (selectedUserId) {
//             const prevIcon = document.querySelector<HTMLElement>(
//                 `.profile[data-user="${selectedUserId}"] .vote-icon`,
//             );
//             prevIcon?.classList.remove(...SHOW_CLASSES);
//             prevIcon?.classList.add(...HIDE_CLASSES);
//         }

//         // 새로운 대상에 투표 표시
//         voteIcon.classList.remove(...HIDE_CLASSES);
//         voteIcon.classList.add(...SHOW_CLASSES);
//         selectedUserId = targetUserId;
//         console.log('투표 대상:', selectedUserId);
//     });
// });

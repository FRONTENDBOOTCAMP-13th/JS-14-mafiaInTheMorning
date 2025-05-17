const modal = document.getElementById('voteModal');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
// 모달 열기
export function openVoteModal() {
    modal.style.display = 'flex';
}
// 모달 닫기
export function closeVoteModal() {
    modal.style.display = 'none';
}
// 초기에는 모달을 숨김 처리
// modal.style.display = 'none';
// 찬성 버튼 클릭
yesButton.addEventListener('click', () => {
    // TODO: 찬성 처리 로직
    // alert('찬성 선택!');
    closeVoteModal();
});
// 반대 버튼 클릭
noButton.addEventListener('click', () => {
    // TODO: 반대 처리 로직
    // alert('반대 선택!');
    closeVoteModal();
});
// 모달 바깥 클릭 시 닫기 (선택)
modal.addEventListener('click', e => {
    if (e.target === modal) {
        closeVoteModal();
    }
});
// // 유저 리스트 (유저 ID가 1~4번 있다고 가정)
// const allUserId = ['1', '2', '3', '4'];
// const voteCounts = new Map<string, string>(); // key: voterId, value: targetId
// let votedTargetUserId: string | null = null;
// const userId = '1'; // 현재 유저
// const profiles = document.querySelectorAll<HTMLElement>('.profile');
// const voteModal = document.getElementById('voteModal')!;
// const yesBtn = document.getElementById('yesButton')!;
// const noBtn = document.getElementById('noButton')!;
// // 투표 클릭
// profiles.forEach(profile => {
//     profile.addEventListener('click', () => {
//         const targetUserId = profile.dataset.user;
//         const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
//         if (!targetUserId || !voteIcon) return;
//         if (targetUserId === userId) {
//             alert('자기 자신에게는 투표할 수 없습니다.');
//             return;
//         }
//         // 이미 같은 유저에게 투표했으면 → 투표 취소
//         if (voteCounts.get(userId) === targetUserId) {
//             voteIcon.classList.add('hidden');
//             voteIcon.classList.remove('flex');
//             voteCounts.delete(userId);
//         } else {
//             // 이전 투표 제거
//             const prevTargetId = voteCounts.get(userId);
//             if (prevTargetId) {
//                 const prevProfile = document.querySelector<HTMLElement>(
//                     `.profile[data-user="${prevTargetId}"]`,
//                 );
//                 const prevIcon =
//                     prevProfile?.querySelector<HTMLElement>('.vote-icon');
//                 prevIcon?.classList.add('hidden');
//                 prevIcon?.classList.remove('flex');
//             }
//             // 새 투표 등록
//             voteIcon.classList.remove('hidden');
//             voteIcon.classList.add('flex');
//             voteCounts.set(userId, targetUserId);
//         }
//         checkMajorityAndShowModal();
//     });
// });
// // 과반수 체크
// function checkMajorityAndShowModal() {
//     const targetCounts: { [key: string]: number } = {};
//     voteCounts.forEach(targetId => {
//         targetCounts[targetId] = (targetCounts[targetId] || 0) + 1;
//     });
//     const majority = Math.floor(allUserId.length / 2) + 1;
//     for (const [targetId, count] of Object.entries(targetCounts)) {
//         if (count >= majority) {
//             // 과반수 넘었을 때 모달 표시
//             votedTargetUserId = targetId;
//             voteModal.classList.remove('hidden');
//             voteModal.classList.add('flex');
//             return;
//         }
//     }
//     // 과반수 안 되면 모달 숨김
//     voteModal.classList.add('hidden');
//     voteModal.classList.remove('flex');
// }
// // 찬반 버튼 이벤트
// yesBtn.addEventListener('click', () => {
//     // alert(`${votedTargetUserId}번 유저가 처형되었습니다.`);
//     voteModal.classList.add('hidden');
//     voteModal.classList.remove('flex');
//     // 추가로 상태 초기화 등 수행 가능
// });
// noBtn.addEventListener('click', () => {
//     // alert(`${votedTargetUserId}번 유저가 살았습니다.`);
//     voteModal.classList.add('hidden');
//     voteModal.classList.remove('flex');
// });
// const allUserId = ['1', '2', '3', '4'];
// const voteCounts = new Map<string, string>(); // key: voterId, value: targetId
// let votedTargetUserId: string | null = null;
// const userId = '1'; // 현재 유저
// const profiles = document.querySelectorAll<HTMLElement>('.profile');
// // 안전하게 DOM 요소 가져오기
// const voteModal = document.getElementById('voteModal');
// const yesBtn = document.getElementById('yesButton');
// const noBtn = document.getElementById('noButton');
// if (!voteModal || !yesBtn || !noBtn) {
//     throw new Error('필수 요소가 문서에 없습니다.');
// }
// // 투표 클릭 이벤트
// profiles.forEach(profile => {
//     profile.addEventListener('click', () => {
//         const targetUserId = profile.dataset.user;
//         const voteIcon = profile.querySelector<HTMLElement>('.vote-icon');
//         if (!targetUserId || !voteIcon) return;
//         if (targetUserId === userId) {
//             alert('자기 자신에게는 투표할 수 없습니다.');
//             return;
//         }
//         // 동일한 유저에게 다시 클릭 → 투표 취소
//         if (voteCounts.get(userId) === targetUserId) {
//             voteIcon.classList.add('hidden');
//             voteIcon.classList.remove('flex');
//             voteCounts.delete(userId);
//         } else {
//             // 이전 투표 제거
//             const prevTargetId = voteCounts.get(userId);
//             if (prevTargetId) {
//                 const prevProfile = document.querySelector<HTMLElement>(
//                     `.profile[data-user="${prevTargetId}"]`,
//                 );
//                 const prevIcon =
//                     prevProfile?.querySelector<HTMLElement>('.vote-icon');
//                 prevIcon?.classList.add('hidden');
//                 prevIcon?.classList.remove('flex');
//             }
//             // 새 투표 등록
//             voteIcon.classList.remove('hidden');
//             voteIcon.classList.add('flex');
//             voteCounts.set(userId, targetUserId);
//         }
//         // 🔽 여기서 최다 득표자 계산
//         const targetCounts: Record<string, number> = {};
//         voteCounts.forEach(target => {
//             targetCounts[target] = (targetCounts[target] || 0) + 1;
//         });
//         const voteValues = Object.values(targetCounts);
//         const maxVote = Math.max(...voteValues, 0); // 최대 득표 수
//         const maxVoted = Object.entries(targetCounts).filter(
//             ([_, count]) => count === maxVote,
//         );
//         // 최다득표자가 1명일 경우에만 모달 표시
//         if (maxVoted.length === 1) {
//             votedTargetUserId = maxVoted[0][0]; // 유일 최다 득표자 ID
//             voteModal.classList.remove('hidden');
//             voteModal.classList.add('flex');
//         } else {
//             voteModal.classList.add('hidden');
//             voteModal.classList.remove('flex');
//         }
//     });
// });
// // 찬성/반대 버튼
// yesBtn.addEventListener('click', () => {
//     voteModal.classList.add('hidden');
//     voteModal.classList.remove('flex');
//     // 실제로는 여기서 처형 로직 처리
// });
// noBtn.addEventListener('click', () => {
//     voteModal.classList.add('hidden');
//     voteModal.classList.remove('flex');
//     // 여기서 처형 취소 처리
// });

// 현재 투표한 대상 유저 ID (null이면 투표 안 한 상태)
let votedTargetUserId = null;
// 현재 유저 ID (로그인한 사용자로 가정)
const currentUserId = '1';
// 모든 프로필 요소 선택
const profiles = document.querySelectorAll('.profile');
profiles.forEach(profile => {
    profile.addEventListener('click', () => {
        const targetUserId = profile.dataset.user;
        const voteIcon = profile.querySelector('.vote-icon');
        if (!targetUserId || !voteIcon)
            return;
        // 자기 자신 투표 못하도록 설정
        if (targetUserId === currentUserId) {
            alert('자기 자신에게는 투표할 수 없습니다.');
            return;
        }
        // 이미 투표한 대상이면 취소
        if (votedTargetUserId === targetUserId) {
            voteIcon.classList.add('hidden'); //투표 아이콘 다시 숨기기
            voteIcon.classList.remove('flex'); //보인 상태 해제
            votedTargetUserId = null; //아무한테도 투표 안 한 상태로 복귀
            return;
        }
        // 다른 유저를 이미 투표한 경우 -> 이전 투표 아이콘 제거 (재투표 가능)
        if (votedTargetUserId !== null) {
            //투표 했는지 확인
            const prevProfile = document.querySelector(//이전에 투표한 프로필 다시 찾음
            `.profile[data-user="${votedTargetUserId}"]`);
            const prevIcon = prevProfile?.querySelector('.vote-icon');
            prevIcon?.classList.add('hidden'); //기존 투표 아이콘 제거
            prevIcon?.classList.remove('flex');
        }
        // 새로 클린한 유저에 투표 아이콘 표시
        voteIcon.classList.remove('hidden'); //현재 클릭한 유저에게 투표 표시
        voteIcon.classList.add('flex');
        votedTargetUserId = targetUserId;
    });
});
export {};

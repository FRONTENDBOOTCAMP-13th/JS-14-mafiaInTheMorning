// 유저 리스트 (예: 유저 ID가 1~4번 있다고 가정)
const allUserIds = ['1', '2', '3', '4'];
const voteCounts = new Map(); // key: voterId, value: targetId
let votedTargetUserId = null;
const currentUserId = '1'; // 현재 유저 (예시)
const profiles = document.querySelectorAll('.profile');
const voteModal = document.getElementById('voteModal');
const yesBtn = document.getElementById('yesButton');
const noBtn = document.getElementById('noButton');
// 투표 클릭
profiles.forEach(profile => {
    profile.addEventListener('click', () => {
        const targetUserId = profile.dataset.user;
        const voteIcon = profile.querySelector('.vote-icon');
        if (!targetUserId || !voteIcon)
            return;
        if (targetUserId === currentUserId) {
            alert('자기 자신에게는 투표할 수 없습니다.');
            return;
        }
        // 이미 같은 유저에게 투표했으면 → 투표 취소
        if (voteCounts.get(currentUserId) === targetUserId) {
            voteIcon.classList.add('hidden');
            voteIcon.classList.remove('flex');
            voteCounts.delete(currentUserId);
        }
        else {
            // 이전 투표 제거
            const prevTargetId = voteCounts.get(currentUserId);
            if (prevTargetId) {
                const prevProfile = document.querySelector(`.profile[data-user="${prevTargetId}"]`);
                const prevIcon = prevProfile?.querySelector('.vote-icon');
                prevIcon?.classList.add('hidden');
                prevIcon?.classList.remove('flex');
            }
            // 새 투표 등록
            voteIcon.classList.remove('hidden');
            voteIcon.classList.add('flex');
            voteCounts.set(currentUserId, targetUserId);
        }
        checkMajorityAndShowModal();
    });
});
// 과반수 체크
function checkMajorityAndShowModal() {
    const targetCounts = {};
    voteCounts.forEach(targetId => {
        targetCounts[targetId] = (targetCounts[targetId] || 0) + 1;
    });
    const majority = Math.floor(allUserIds.length / 2) + 1;
    for (const [targetId, count] of Object.entries(targetCounts)) {
        if (count >= majority) {
            // 과반수 넘었을 때 모달 표시
            votedTargetUserId = targetId;
            voteModal.classList.remove('hidden');
            voteModal.classList.add('flex');
            return;
        }
    }
    // 과반수 안 되면 모달 숨김
    voteModal.classList.add('hidden');
    voteModal.classList.remove('flex');
}
// 찬반 버튼 이벤트
yesBtn.addEventListener('click', () => {
    alert(`✅ ${votedTargetUserId}번 유저가 처형되었습니다.`);
    voteModal.classList.add('hidden');
    voteModal.classList.remove('flex');
    // 추가로 상태 초기화 등 수행 가능
});
noBtn.addEventListener('click', () => {
    alert(`❌ ${votedTargetUserId}번 유저가 살았습니다.`);
    voteModal.classList.add('hidden');
    voteModal.classList.remove('flex');
});
export {};

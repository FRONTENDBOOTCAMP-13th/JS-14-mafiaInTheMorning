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
// modal.style.display = 'none'; // 페이지 열리면 모달을 숨김

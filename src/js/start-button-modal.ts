const mainstartBtn = document.getElementById(
    'main-startButton',
) as HTMLButtonElement;
const nicknameModal = document.getElementById(
    'nicknameModal',
) as HTMLDivElement;
const nickconfirmBtn = document.getElementById(
    'confirmBtn',
) as HTMLButtonElement;
const nicknameInput = document.getElementById(
    'nicknameInput',
) as HTMLInputElement;

mainstartBtn.addEventListener('click', () => {
    nicknameModal.classList.remove('hidden');
    nicknameModal.classList.add('flex');
});

nickconfirmBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    if (nickname) {
        console.log(`닉네임: ${nickname}`);
        nicknameModal.classList.add('hidden');
        nicknameInput.value = '';
    } else {
        alert('닉네임을 입력해주세요.');
    }
});

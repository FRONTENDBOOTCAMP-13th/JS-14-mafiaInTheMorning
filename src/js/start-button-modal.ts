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
        nicknameModal.classList.add('hidden');
        nicknameInput.value = '';
        console.log(nickname);
        window.location.href = `/src/pages/server-page.html?nickname=${encodeURIComponent(nickname)}`;
    } else {
        alert('닉네임을 입력해주세요.');
    }
});

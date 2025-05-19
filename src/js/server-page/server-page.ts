const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname') as string;

const ch00 = document.querySelector('#ch00');
const ch01 = document.querySelector('#ch01');

ch00?.addEventListener('click', () => {
    window.location.href = `/src/pages/chatlist-page.html?nickname=${encodeURIComponent(nickname)}`;
});

ch01?.addEventListener('click', () => {
    alert('채널이 준비중입니다..');
});

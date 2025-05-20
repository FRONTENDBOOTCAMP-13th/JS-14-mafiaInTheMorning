import { socket } from '../lib/yongchat';

export function renderKillTargets(
    members: { user_id: string; nickName: string }[],
    myUserId: string,
    myRole: string,
) {
    if (myRole !== 'mafia') {
        return;
    }

    const container = document.querySelector('#kill-target') as HTMLElement;
    container.innerHTML = '<h3>킬 대상 선택:</h3>';

    members.forEach(member => {
        if (member.user_id === myUserId) {
            // 자기 자신은 제외 시킴
            return;
        }
        const btn = document.createElement('button');
        btn.textContent = member.nickName;
        btn.className = 'kill-button';
        btn.addEventListener('click', () => {
            const confirmKill = confirm(`${member.nickName}을 죽이시겠습니까?`);
            if (confirmKill) {
                socket.emit('message', {
                    action: 'kill',
                    from: myUserId,
                    targetId: member.user_id,
                });
                console.log(`${member.nickName}을 죽였습니다.`);
                container.innerHTML = `<p>선택 완료</p>`;
            }
        });
        container.appendChild(btn);
    });
}

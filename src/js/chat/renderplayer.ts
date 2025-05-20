export function renderPlayerList(
    members: { user_id: string; nickName: string }[],
    containerId: string = 'player-list',
) {
    const container = document.querySelector(`#${containerId}`) as HTMLElement;
    container.innerHTML = '<h3>플레이어 목록</h3>';

    const list = document.createElement('ul');
    members.forEach((member, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${member.nickName}`;
        list.appendChild(li);
    });

    container.appendChild(list);
}

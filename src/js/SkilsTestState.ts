export const players = [
    { id: 'user1', name: '나', role: 'mafia', alive: true },
    { id: 'user2', name: '유저1', role: 'citizen', alive: true },
    { id: 'user3', name: '유저2', role: 'citizen', alive: true },
    { id: 'user4', name: '유저3', role: 'citizen', alive: true },
    { id: 'user5', name: '유저4', role: 'citizen', alive: true },
    { id: 'user6', name: '유저5', role: 'citizen', alive: true },
    { id: 'user7', name: '유저6', role: 'mafia', alive: true },
    { id: 'user8', name: '유저7', role: 'citizen', alive: true },
];
// 낮밤 설정을 위한 가정
export let canKill = true;
export let gameDay: 'night' | 'morning' = 'night';
export let canFind = true;

export function setGameDay(day: 'night' | 'morning') {
    gameDay = day;
}

export function setCanKill(value: boolean) {
    canKill = value;
}

export function setCanFind(value: boolean) {
    canFind = value;
}

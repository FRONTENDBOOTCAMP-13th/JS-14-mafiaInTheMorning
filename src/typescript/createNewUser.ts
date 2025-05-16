export interface User {
    userId: number;
    nickname: string;
}

const btn = document.querySelector('#createNewUserbtn');
btn?.addEventListener('click', () => {
    readInput();
});

// input에 작성된 값을 읽어오는 함수
function readInput() {
    const input = document.querySelector(
        'input[type="text"]',
    ) as HTMLInputElement;

    if (input) {
        const nickname = input.value;
        addUser(nickname);
    } else {
        console.error('Input 요소를 찾을 수 없습니다.');
    }
}

const userList: User[] = [];
let currentId = 1;

function addUser(nickname: string): void {
    const newUser: User = {
        userId: currentId++,
        nickname,
    };
    userList.push(newUser);
}

console.log(userList);

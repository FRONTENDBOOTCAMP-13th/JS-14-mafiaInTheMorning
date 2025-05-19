// 역할 타입 정의
type Role = '마피아' | '경찰' | '의사' | '시민';

//참가자 수에 따라 역할을 생성하여 랜덤하게 섞은 배열을 반환,
//@param playerCount 참가자 수 (4 이상)*/,

function assignRoles(playerCount: number): Role[] {
    if (playerCount < 4) {
        throw new Error('참가자는 최소 4명 이상이어야 합니다.');
    }

    const roles: Role[] = [];

    if (playerCount <= 5) {
        // 마피아 1, 경찰 1, 나머지는 시민
        roles.push('마피아', '경찰');
        for (let i = 0; i < playerCount - 2; i++) {
            roles.push('시민');
        }
    } else if (playerCount <= 7) {
        // 마피아 1, 경찰 1, 의사 1, 나머지는 시민
        roles.push('마피아', '경찰', '의사');
        for (let i = 0; i < playerCount - 3; i++) {
            roles.push('시민');
        }
    } else {
        // 마피아 2, 경찰 1, 의사 1, 나머지는 시민
        roles.push('마피아', '마피아', '경찰', '의사');
        for (let i = 0; i < playerCount - 4; i++) {
            roles.push('시민');
        }
    }

    return shuffleArray(roles);
}

//배열을 무작위로 섞는 함수 (Fisher-Yates 알고리즘 사용)*/,
function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]; // 원본 보존
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); //Math.random()을 활용해 요소 위치를 랜덤하게 바꿈
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

//console 출력으로 확인
const roles = assignRoles(8);
console.log(roles);

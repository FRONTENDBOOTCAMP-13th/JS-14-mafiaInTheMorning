// 낮에 투표
// 마피아 찾기
// 낮에 모두 투표함
// 1. 닉네임을 가져와서 화면에 띄우기 -> 방에 들어오면 닉네임(+프로필) 생성
// 2. 프로필 클릭하면 투표됨
// 만약 방을 나가면 프로필 사라진다

import { type Vote } from '../lib/yongchat'; //user_Id 가져오기

//userProfiles : 유저들의 닉네임들(프로필)
// memberList: 방에 있는 모든 유저 목록
// memberList -> user_Id있음
export function userProfiles(memberList: Vote) {
    const profileList = document.querySelector('#profiles') as HTMLElement;
    const users: Vote[] = Object.keys(memberList).map(user_id => {
        console.log(user_id);
        return user_id;
    });

    profileList.textContent = memberList.user_id;
    if (!profileList) return;
    profileList.innerHTML = '';

    profileList.forEach(profileList => {
        console.log(profileList.user_Id);
    });
}

import {
    sendMsg,
    type Role,
    type RoomMembers,
    type StartGame,
} from '../lib/yongchat';
import { assignRoles } from '../random-role';

export function startGame(memberList: RoomMembers) {
    const randomRoles = assignRoles(Object.keys(memberList).length);
    const roles: Role[] = Object.keys(memberList).map((user_id, i) => {
        console.log(user_id);
        return {
            user_id,
            role: randomRoles[i],
        };
    });

    const msg: StartGame = {
        action: 'start',
        roles,
    };
    sendMsg(msg);
}

export function getMyRole(roles: Role[], user_id: string) {
    return roles.find(role => role.user_id === user_id)?.role;
}

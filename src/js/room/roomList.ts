import { type RoomsResponse } from '../lib/yongchat';

const roomList = document.querySelector('#room-list');

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname') as string;

export function setRooms(rooms: RoomsResponse) {
    // console.log('게임 목록:', rooms);
    for (const key in rooms) {
        const roomInfo = rooms[key];

        const room = `
      <li data-id="${roomInfo.roomId}">
        <a href="/src/pages/chat.html?roomId=${encodeURIComponent(roomInfo.roomId)}&user_id=${encodeURIComponent(nickname)}">
          <div
            class="bg-black bg-opacity-80 backdrop-blur-md p-6 rounded-xl flex items-center justify-between shadow shadow-[#5D010A] border-4 border-[#5D010A]"
        >
            <div>
                <h2 class="text-white text-xl font-bold">
                    🔥 ${roomInfo.roomName}
                </h2>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-gray-400 font-semibold text-lg"
                    >${Object.keys(roomInfo.memberList).length}/10</span
                >
            </div>
          </div>
        </a>
      </li>
    `;

        if (roomList) {
            roomList.innerHTML = roomList.innerHTML + room;
        }
    }
}

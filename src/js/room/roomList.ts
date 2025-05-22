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
        <a
          href="/src/pages/chat.html?roomId=${encodeURIComponent(roomInfo.roomId)}&user_id=${encodeURIComponent(nickname)}"
          class="block"
        >
          <div
            class="bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 backdrop-blur-md p-6 rounded-2xl flex items-center justify-between shadow-md shadow-[#7a2100] border-4 border-[#5D010A] mb-5 transition duration-300 hover:shadow-xl hover:border-amber-500 hover:scale-[1.02]"
          >
            <div>
              <h2
                class="text-white text-xl font-extrabold tracking-wide drop-shadow-[0_0_6px_rgba(255,170,0,0.7)]"
              >
                🔥 ${roomInfo.roomName}
              </h2>
            </div>
            <div class="flex items-center gap-4">
              <span
                class="text-gray-400 font-semibold text-lg tracking-wide select-none"
                >${Object.keys(roomInfo.memberList).length}/8</span
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

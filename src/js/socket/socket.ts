export const socket = io('ws://fesp-api.koyeb.app/febc13-chat/team01');

socket.on('connect', () => {
    console.log('connect with server!');
});

// 마피아 게임의 플레이어 상태를 관리하는 스토어 모듈
import type { LiveOrDiePlayer, RoomMembers } from "./yongchat";

// 게임에 참여중인 모든 플레이어의 목록과 상태를 저장하는 객체
let playerList: RoomMembers = {};
// 현재 생사가 걸린 투표 상황에 처한 플레이어 정보
let liveOrDiePlayer: LiveOrDiePlayer;

/**
 * 게임에 참여중인 플레이어 목록을 업데이트합니다
 * @param memberList 갱신된 방 참여자 목록
 */
export function setPlayerList(memberList: RoomMembers){
  playerList = memberList;
}

/**
 * 현재 게임에 참여중인 플레이어 목록을 반환합니다
 * @returns 현재 플레이어 목록과 각 플레이어의 상태
 */
export function getPlayerList(){
  return playerList;
}

/**
 * 게임에서 플레이어가 죽었음을 표시합니다
 * @param playerId 죽은 플레이어의 ID
 */
export function killed(playerId: string){
  playerList[playerId].killed = true;
}

/**
 * 모든 플레이어의 투표 수를 0으로 초기화합니다
 * 각 투표 라운드가 시작될 때 사용됩니다
 */
export function initVote(){
  for(const playerId in playerList){
    playerList[playerId].vote = 0;
  }
}

/**
 * 생사가 걸린 상황에 처한 플레이어를 설정합니다
 * @param player 생사가 걸린 플레이어 정보
 */
export function setLiveOrDiePlayer(player: LiveOrDiePlayer){
  liveOrDiePlayer = player;
}

/**
 * 현재 생사가 걸린 상황에 처한 플레이어 정보를 반환합니다
 * @returns 생사가 걸린 플레이어 정보
 */
export function getLiveOrDiePlayer(){
  return liveOrDiePlayer;
}
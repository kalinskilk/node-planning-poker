export interface IDataRoom {
  action: "FLIP_CARDS" | "VOTE" | "RESTART_VOTATION" | "JOIN_ROOM";
  data?: any;
  roomId: string;
}

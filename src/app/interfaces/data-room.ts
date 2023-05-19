export interface IDataRoom {
  action:
    | "FLIP_CARDS"
    | "VOTE"
    | "RESTART_VOTATION"
    | "JOIN_ROOM"
    | "USER_LEAVED";
  data?: any;
  roomId: string;
}

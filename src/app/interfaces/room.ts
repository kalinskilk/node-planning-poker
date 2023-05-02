import { IPlayer } from "./player";
import { IVotesRoom } from "./votes-room";

export class IRoom {
  id: string;
  players: IPlayer[];
  votes: IVotesRoom[];
  blockVotes: boolean;
}

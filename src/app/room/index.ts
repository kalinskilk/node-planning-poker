import { randomUUID } from "crypto";
import { IPlayer, IRoom, IVotesRoom } from "../interfaces";

export class Rooms {
  rooms: IRoom[] = [];

  newRoom(player: IPlayer): string {
    const id = randomUUID();
    const room: IRoom = {
      id,
      players: [player],
      votes: [],
      blockVotes: false,
    };
    this.rooms.push(room);
    return id;
  }

  vote(votesRoom: IVotesRoom, roomId: string): boolean {
    const room = this.rooms.find((el) => el.id === roomId);
    console.log("voteee", room);
    if (!room || room?.blockVotes) {
      return false;
    } else if (
      !room?.votes?.length ||
      !room?.votes?.find((el) => el.nameUser === votesRoom.nameUser)
    ) {
      room?.votes?.push(votesRoom);
      return true;
    } else if (
      !!room?.votes?.find((el) => el.nameUser === votesRoom.nameUser)
    ) {
      for (const vote of room?.votes) {
        if (vote.nameUser !== votesRoom.nameUser) {
          continue;
        }
        vote.vote = votesRoom.vote;
      }
      return true;
    }

    return true;
  }

  clearVotes(roomId: string) {
    const room = this.rooms.find((el) => el.id === roomId);
    if (!!room) {
      room.votes = [];
      room.blockVotes = false;
    }
  }

  joinRoom(
    player: IPlayer,
    roomId: string
  ): { success: boolean; message: string } {
    const room = this.rooms.find((el) => el.id === roomId);
    if (!room) {
      return { success: false, message: "Room does not exists." };
    }
    if (!room.players?.filter((el) => el.name === player.name).length) {
      room.players.push(player);
    }
    return { success: true, message: "Success you are joined at room." };
  }

  flipCards(roomId: string): void {
    const room = this.rooms.find((el) => el.id === roomId);
    if (room) {
      room.blockVotes = true;
    }
  }

  getRoom(roomId: string): { data: { room: IRoom | null }; success: true } {
    return {
      data: { room: this.rooms.find((el) => el.id === roomId) || null },
      success: true,
    };
  }
}

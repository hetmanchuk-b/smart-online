import {Room, Member, User, Team, Quiz, Answer, Question, Message} from '@prisma/client';
import {Server as NetServer, Socket} from 'net';
import {NextApiResponse} from "next";
import {Server as SocketIOServer} from 'socket.io';

export type RoomWithMembersWithProfiles = Room & {
  members: (Member & {user: User})[];
}
export type RoomWithMembersAndTeamsWithProfilesWithTeam = Room & {
  teams: Team[];
  members: (Member & {
    user: User;
    team: Team;
  })[];
}

export type RoomWithTeamsWithPlayersAndMembersWithUsers = Room & {
  teams: (Team & {teamMembers: (Member & {user: User})[]})[];
  members: (Member & {user: User})[];
}

export type TeamWithMembersWithUsers = Team & {
  teamMembers: MemberWithUser[];
}

export type MemberWithUser = Member & {
  user: User
}

export type QuizWithQuestionsWithAnswers = Quiz & {
  questions: (Question & {
    variants: Answer[]
  })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    user: User;
  }
}

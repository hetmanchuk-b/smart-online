import type {DefaultSession, DefaultUser, Session, User} from 'next-auth';
import type {JWT} from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}

// declare module 'next-auth' {
//   interface Session {
//     id: UserId;
//     username?: string | null;
//   }
// }

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      username?: string | null;
    };
  }
  interface User extends DefaultUser {
    username?: string | null;
  }
}

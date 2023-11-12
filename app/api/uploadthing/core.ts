import { createUploadthing, type FileRouter } from "uploadthing/next";
import {getToken} from "next-auth/jwt";
import {getAuthSession} from "@/lib/auth";

const f = createUploadthing();

/* eslint-disable */
export const ourFileRouter = {
  questionImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getAuthSession()

      if (!session?.user) throw new Error('Unauthorized')

      return { userId: session.user.id }
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;
/* eslint-enable */
export type OurFileRouter = typeof ourFileRouter;

import {NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";

export async function PATCH(
  req: Request,
  {params}: {params: {teamId: string}}
) {
  try {
    const session = await getAuthSession();
    const {name, score} = await req.json();

    if (!session?.user) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    if (!params.teamId) {
      return new NextResponse('Team ID missing', {status: 400});
    }

    const team = await db.team.update({
      where: {
        id: params.teamId,
      },
      data: {
        name,
        score
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.log("[EDIT TEAM API_ERROR]", error);
    return new NextResponse('Internal Error', {status: 500});
  }
}

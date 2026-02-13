import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";


export async function GET() {
    const session = await getSession();

    if(!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ message: "Protected data", user: session }, { status: 200 })
}
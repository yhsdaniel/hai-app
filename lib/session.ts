import { cookies } from "next/headers";
import redis from "@/lib/redis";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  
  if (!sessionId) return null;

  const session = await redis.get(`session:${sessionId}`);

  if (!session) return null;

  return JSON.parse(session as string);
}
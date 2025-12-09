import { connect } from "@/config/mongodb";
import Conversation from "@/config/schema/conversation";
import User from "@/config/schema/user";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { myUserId, targetUsername } = reqBody

        // Find user target
        const targetUser = await User.findOne({ username: targetUsername })

        if (!targetUser) {
            return NextResponse.json({ error: 'Username not found' }, { status: 404 })
        }

        // Pastikan User A tidak mengobrol dengan dirinya sendiri
        if (targetUser._id.toString() === myUserId) {
            return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 });
        }

        // 2. Standardisasi & Urutkan ID
        // Kita menggunakan string untuk sorting yang konsisten.
        const participantIds = [myUserId, targetUser._id.toString()];
        participantIds.sort();

        // 3. Pencarian Percakapan 1-on-1
        // Kriteria pencarian: 
        // a. Peserta harus sama persis dengan array yang sudah diurutkan.
        // b. Tambahkan flag isGroup: false jika Anda berencana membuat fitur grup di masa depan.
        let conversation = await Conversation.findOne({
            participants: participantIds,
            // Jika Anda menambahkan isGroup: { type: Boolean, default: false } ke Schema:
            // isGroup: false 
        });

        if (!conversation) {
            // 4. Buat Percakapan Baru menggunakan array yang sudah diurutkan
            conversation = await Conversation.create({
                participants: participantIds
            });
        }

        return NextResponse.json({
            message: "Chat ready",
            conversation: conversation
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
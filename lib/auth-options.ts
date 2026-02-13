import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '../config/schema/user'
import { compare } from 'bcryptjs'
import { NextAuthOptions } from "next-auth";
import { connect } from '../config/mongodb';
import redis from './redis';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 1 * 60 * 60 * 24,
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(crendentials) {
                await connect()

                if (!crendentials?.email || !crendentials?.password) { return null }

                const existingUser = await User.findOne({ email: crendentials.email })
                if (!existingUser || !existingUser.password) return null

                const passwordMatch = await compare(crendentials.password, existingUser.password)
                if (!passwordMatch) return null

                return {
                    id: existingUser.id.toString(),
                    name: existingUser.username,
                    email: existingUser.email,
                    phoneNumber: existingUser.phoneNumber
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            await connect()

            if (user) {
                // If Google Sign in
                if (account?.provider === "google" && profile?.email) {
                    let existingUser = await User.findOne({ email: profile.email })

                    if (!existingUser) {
                        existingUser = await User.create({
                            _id: profile.sub,
                            email: profile.email,
                            username: profile.name,
                        })
                    }
                    token.id = existingUser._id.toString()
                    token.username = existingUser.username
                    token.email = existingUser.email

                    // If Credentials Sign in
                } else if (account?.provider === 'credentials') {
                    token.username = user.name
                    token.email = user.email
                    token.id = user.id

                    // Cache in Redis
                    await redis.set(
                        `session:${user.id}`,
                        JSON.stringify({
                            id: user.id,
                            username: user.name,
                            email: user.email
                        }),
                        'EX',
                        60 * 60 * 24 * 7 // 7 days expiration
                    )
                }
            }
            return token
        },
        async session({ session, token }) {
            const cachedUser = await redis.get(`session:${token?.id}_${new Date().getTime()}`);
            if (cachedUser) {
                session.user = cachedUser as any
                return session
            }

            session.user = {
                id: token?.id as string,
                username: token?.username as string,
                email: token?.email as string
            }

            return session
        },
        async redirect({ url, baseUrl }) {
            // if (url.startsWith('/')) {
            //     return `${baseUrl}/chat`
            // } else if (new URL(url).origin === baseUrl) {
            //     return url
            // }
            return `${baseUrl}/chat`
        }
    },
    // events: {
    //     async signOut({ token }) {
    //         if (token?.id) {
    //             await redis.del(`session:${token.id}`)
    //         }
    //     }
    // }
}
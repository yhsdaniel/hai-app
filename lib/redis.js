// import { Redis } from "@upstash/redis";

// export const redis = new Redis({
//     url: process.env.UPSTASH_REDIS_REST_URL,
//     token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

// export default redis;

import Redis from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: Number(process.env.REDIS_PASSWORD),
//     db: Number(process.env.REDIS_DB),
// });

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
    console.log('Redis connected')
})

redis.on('error', (err) => {
    console.error('Redis error', err)
})

export default redis;
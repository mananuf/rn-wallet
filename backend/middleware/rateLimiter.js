import ratelimit from "../config/upstash.js";

export const rateLimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimit.limit("put-a-unique-identifier");

        if (!success) {
            return res.status(429).json({
                message: "Too Many Requests, please try again later",
            });
        }

        next()
    } catch (e) {
        console.log("Rate Limiter Error: ",e);

        next(e)
    }
}
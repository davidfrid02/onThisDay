const { TwitterApi } = require("twitter-api-v2");

class TwitterApiService {
    constructor(apiKey, apiSecret, accessToken, accessSecret) {
        this.twitter = new TwitterApi({
            appKey: apiKey,
            appSecret: apiSecret,
            accessToken: accessToken,
            accessSecret: accessSecret,
        });
    }

    async postTweet(imageBuffer, tweetText) {
        try {
            const mediaId = await this.twitter.v1.uploadMedia(imageBuffer, { mimeType: "image/png" });

            const tweet = await this.twitter.v2.tweet({
                text: tweetText,
                media: { media_ids: [mediaId] },
            });
            return tweet;
        } catch (error) {
            console.error("Error:", error.message);
            throw error;
        }
    }
}

module.exports = TwitterApiService;

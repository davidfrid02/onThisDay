const loadConfig = require("./config/config.js");
const OpenApiService = require("./services/openApiService.js");
const TwitterApiService = require("./services/twitterApiService.js");
const InsightaServices = require("./services/insightaServices.js");
const fs = require("fs");

class Main {
    constructor() {
        console.log("Loading config...");
        this.config = loadConfig();
        this.openApiService = new OpenApiService(this.config.openApiKey);
        this.insightaServices = new InsightaServices();
        this.twitterApiService = new TwitterApiService(
            this.config.twitterApiKey,
            this.config.twitterApiSecret,
            this.config.twitterAccessToken,
            this.config.twitterAccessTokenSecret
        );
    }

    async start() {
        try {
            console.log("Starting Twitter AI Creator...\n");

            const todayFact = await this.insightaServices.getTodayFact();
            const imagePrompt = await this.openApiService.generateImagePrompt(todayFact);
            const imageBuffer = await this.openApiService.generateImageDallE3(imagePrompt, this.config.saveLocal);

            const tweetResponse = await this.twitterApiService.postTweet(imageBuffer, todayFact);

            console.log("All done! Check the tweet in the Twitter.", tweetResponse);
        } catch (error) {
            console.error("Error:", error.message);
            throw error;
        }
    }
}

module.exports = Main;

const dotenv = require("dotenv");
const requiredEnvVars = ["OPENAI_API_KEY", "TWITTER_API_KEY", "TWITTER_API_SECRET", "TWITTER_ACCESS_TOKEN", "TWITTER_ACCESS_SECRET"];

const loadConfig = () => {
    dotenv.config();
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
    return {
        openApiKey: process.env.OPENAI_API_KEY,
        twitterApiKey: process.env.TWITTER_API_KEY,
        twitterApiSecret: process.env.TWITTER_API_SECRET,
        twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
        twitterAccessTokenSecret: process.env.TWITTER_ACCESS_SECRET,
        saveLocal: process.env.SAVE_LOCAL === "true" || false,
    };
};

module.exports = loadConfig;

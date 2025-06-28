# OnThisDay - AI-Powered Historical Twitter Bot

An automated Twitter bot that generates and posts historical "On This Day" content with AI-generated images. The bot fetches historical events from the MuffinLabs History API, generates relevant images using OpenAI's DALL-E 3, and posts them to Twitter.

## 🚀 Features

-   **Historical Event Fetching**: Retrieves random historical events from the MuffinLabs History API
-   **AI Image Generation**: Uses OpenAI's DALL-E 3 to create cinematic images based on historical events
-   **Automated Twitter Posting**: Posts the historical fact with the generated image to Twitter
-   **AWS Lambda Ready**: Designed to run as a serverless function on AWS Lambda
-   **Local Development Support**: Can be run locally for testing and development

## 📋 Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   OpenAI API key
-   Twitter API credentials (API Key, API Secret, Access Token, Access Token Secret)

## 🛠️ Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd OnThisDay
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    TWITTER_API_KEY=your_twitter_api_key_here
    TWITTER_API_SECRET=your_twitter_api_secret_here
    TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
    TWITTER_ACCESS_SECRET=your_twitter_access_token_secret_here
    SAVE_LOCAL=false
    ```

## 🏃‍♂️ Usage

### Local Development

To test the application locally, uncomment the test section in `index.js`:

```javascript
(async () => {
    console.log("Starting...");
    const main = new Main();
    console.log("Starting main process...");
    await main.start();
    console.log("All done!");
})();
```

Then run:

```bash
node index.js
```

## 📁 Project Structure

```
OnThisDay/
├── index.js                 # Main entry point for local development
├── lambda.js               # AWS Lambda handler
├── package.json            # Project dependencies and scripts
├── src/
│   ├── main.js            # Main application logic
│   ├── config/
│   │   └── config.js      # Environment configuration loader
│   └── services/
│       ├── insightaServices.js    # Historical data fetching service
│       ├── openApiService.js      # OpenAI API integration
│       └── twitterApiService.js   # Twitter API integration
├── assets/
│   └── images/            # Generated images (when SAVE_LOCAL=true)
└── lambda-deployment/     # Deployment package for AWS Lambda
```

## 🔧 Configuration

### Environment Variables

| Variable                | Description                                | Required            |
| ----------------------- | ------------------------------------------ | ------------------- |
| `OPENAI_API_KEY`        | Your OpenAI API key                        | Yes                 |
| `TWITTER_API_KEY`       | Your Twitter API key                       | Yes                 |
| `TWITTER_API_SECRET`    | Your Twitter API secret                    | Yes                 |
| `TWITTER_ACCESS_TOKEN`  | Your Twitter access token                  | Yes                 |
| `TWITTER_ACCESS_SECRET` | Your Twitter access token secret           | Yes                 |
| `SAVE_LOCAL`            | Save generated images locally (true/false) | No (default: false) |

## 🤖 How It Works

1. **Historical Data Retrieval**: The bot fetches today's historical events from the MuffinLabs History API
2. **Event Selection**: Randomly selects one historical event from the available events
3. **Image Prompt Generation**: Uses OpenAI to generate a cinematic image prompt based on the historical event
4. **Image Generation**: Creates an image using DALL-E 3 based on the generated prompt
5. **Twitter Posting**: Uploads the image and posts the historical fact to Twitter

## 🔒 Security

-   Never commit your `.env` file to version control
-   The `.gitignore` file is configured to exclude sensitive files
-   API keys and secrets are loaded from environment variables

## 🚀 Deployment

### Common Issues

1. **Missing Environment Variables**: Ensure all required environment variables are set
2. **Twitter API Rate Limits**: The bot respects Twitter's rate limits
3. **OpenAI API Quotas**: Monitor your OpenAI API usage and quotas
4. **Image Generation Failures**: Check if the generated prompt is appropriate for DALL-E 3

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

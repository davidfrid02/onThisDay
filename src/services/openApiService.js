const fs = require("fs").promises;
const OpenAI = require("openai");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

class OpenApi {
    constructor(openApiKey) {
        this.openai = new OpenAI({
            apiKey: openApiKey,
        });

        this.models = {
            dallE3: "dall-e-3",
            dallE2: "dall-e-2",
            gptImage1: "gpt-image-1",
            gpt4Turbo: "gpt-4-turbo-preview",
            gpt4o: "gpt-4o",
        };

        this.imagePath = "assets/images";
    }

    async generateImagePrompt(onThisDayDescription, style = "cinematic") {
        console.log("Generating prompt...");

        const description = onThisDayDescription.split("\n\n")[0];
        const response = await this.openai.responses.create({
            prompt: {
                id: "pmpt_6860331f8aac819580fcafda5b21aab70bd3d8e39fdae7f7",
                version: "2",
                variables: {
                    style: style,
                    onthisdaydescription: description,
                },
            },
        });

        const generatedPrompt = response.output_text;
        console.log(`Prompt generated successfully: ${generatedPrompt}\n`);
        return generatedPrompt;
    }

    async generateImageDallE3(prompt, saveLocal = false) {
        console.log("Generating image...");
        const result = await this.openai.images.generate({
            model: this.models.dallE3,
            prompt,
            n: 1,
            size: "1024x1024",
        });

        const image_url = result.data[0].url;
        const imageBytes = await axios.get(image_url, { responseType: "arraybuffer" });
        if (saveLocal) {
            const uuid = uuidv4();
            const imagePath = `${this.imagePath}/${uuid}.png`;
            await fs.writeFile(imagePath, imageBytes.data);
        }

        const bufferImage = Buffer.from(imageBytes.data);
        console.log("Image generated successfully\n");
        return bufferImage;
    }
}

module.exports = OpenApi;

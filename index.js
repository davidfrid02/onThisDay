const Main = require("./src/main.js");

exports.handler = async (event, context) => {
    try {
        const main = new Main();
        await main.start();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Video generation completed successfully",
            }),
        };
    } catch (error) {
        console.error(`Lambda function error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};

//run this file to test the lambda function locally
// (async () => {
//     console.log("Starting...");
//     const main = new Main();
//     console.log("Starting main process...");
//     await main.start();
//     console.log("All done!");
// })();

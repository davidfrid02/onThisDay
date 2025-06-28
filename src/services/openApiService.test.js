const { describe, it, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

let OpenApi, openaiStub;

describe("OpenApi", () => {
    let instance;
    let openaiResponsesCreateStub;
    let openaiImagesGenerateStub;
    let axiosGetStub;
    let fsWriteFileStub;
    let uuidv4Stub;
    let consoleStub;

    beforeEach(() => {
        openaiResponsesCreateStub = sinon.stub();
        openaiImagesGenerateStub = sinon.stub();
        openaiStub = function () {
            return {
                responses: { create: openaiResponsesCreateStub },
                images: { generate: openaiImagesGenerateStub },
            };
        };
        openaiStub.prototype = {
            responses: { create: openaiResponsesCreateStub },
            images: { generate: openaiImagesGenerateStub },
        };

        axiosGetStub = sinon.stub();
        fsWriteFileStub = sinon.stub();
        uuidv4Stub = sinon.stub();

        OpenApi = proxyquire("./openApiService", {
            openai: openaiStub,
            axios: { get: axiosGetStub },
            fs: { promises: { writeFile: fsWriteFileStub } },
            uuid: { v4: uuidv4Stub },
        });

        consoleStub = sinon.stub(console, "log");
        instance = new OpenApi("fake-key");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("constructor", () => {
        it("should initialize with correct models and imagePath", () => {
            expect(instance.models.dallE3).to.equal("dall-e-3");
            expect(instance.imagePath).to.equal("assets/images");
        });
    });

    describe("generateImagePrompt", () => {
        it("should call OpenAI responses.create and return output_text", async () => {
            openaiResponsesCreateStub.resolves({ output_text: "A prompt" });
            const result = await instance.generateImagePrompt("Some description\n\nExtra");
            expect(openaiResponsesCreateStub.calledOnce).to.be.true;
            expect(result).to.equal("A prompt");
            expect(consoleStub.called).to.be.true;
        });

        it("should use the first paragraph of the description", async () => {
            openaiResponsesCreateStub.resolves({ output_text: "Prompt" });
            await instance.generateImagePrompt("First\n\nSecond");
            const callArgs = openaiResponsesCreateStub.firstCall.args[0];
            expect(callArgs.prompt.variables.onthisdaydescription).to.equal("First");
        });

        it("should throw if OpenAI responses.create fails", async () => {
            openaiResponsesCreateStub.rejects(new Error("fail"));
            try {
                await instance.generateImagePrompt("desc");
                throw new Error("Should have thrown");
            } catch (err) {
                expect(err.message).to.equal("fail");
            }
        });
    });

    describe("generateImageDallE3", () => {
        it("should call OpenAI images.generate and return a buffer", async () => {
            openaiImagesGenerateStub.resolves({ data: [{ url: "http://img" }] });
            axiosGetStub.resolves({ data: Buffer.from([1, 2, 3]) });
            const result = await instance.generateImageDallE3("prompt");
            expect(openaiImagesGenerateStub.calledOnce).to.be.true;
            expect(axiosGetStub.calledOnceWith("http://img", { responseType: "arraybuffer" })).to.be.true;
            expect(Buffer.isBuffer(result)).to.be.true;
            expect(consoleStub.called).to.be.true;
        });

        it("should save image locally if saveLocal is true", async () => {
            openaiImagesGenerateStub.resolves({ data: [{ url: "http://img" }] });
            axiosGetStub.resolves({ data: Buffer.from([1, 2, 3]) });
            uuidv4Stub.returns("uuid");
            await instance.generateImageDallE3("prompt", true);
            expect(fsWriteFileStub.calledOnce).to.be.true;
            expect(fsWriteFileStub.firstCall.args[0]).to.equal("assets/images/uuid.png");
        });

        it("should not save image locally if saveLocal is false", async () => {
            openaiImagesGenerateStub.resolves({ data: [{ url: "http://img" }] });
            axiosGetStub.resolves({ data: Buffer.from([1, 2, 3]) });
            await instance.generateImageDallE3("prompt", false);
            expect(fsWriteFileStub.notCalled).to.be.true;
        });

        it("should throw if OpenAI images.generate fails", async () => {
            openaiImagesGenerateStub.rejects(new Error("fail-image"));
            try {
                await instance.generateImageDallE3("prompt");
                throw new Error("Should have thrown");
            } catch (err) {
                expect(err.message).to.equal("fail-image");
            }
        });

        it("should throw if axios.get fails", async () => {
            openaiImagesGenerateStub.resolves({ data: [{ url: "http://img" }] });
            axiosGetStub.rejects(new Error("fail-axios"));
            try {
                await instance.generateImageDallE3("prompt");
                throw new Error("Should have thrown");
            } catch (err) {
                expect(err.message).to.equal("fail-axios");
            }
        });

        it("should throw if fs.writeFile fails when saveLocal is true", async () => {
            openaiImagesGenerateStub.resolves({ data: [{ url: "http://img" }] });
            axiosGetStub.resolves({ data: Buffer.from([1, 2, 3]) });
            uuidv4Stub.returns("uuid");
            fsWriteFileStub.rejects(new Error("fail-fs"));
            try {
                await instance.generateImageDallE3("prompt", true);
                throw new Error("Should have thrown");
            } catch (err) {
                expect(err.message).to.equal("fail-fs");
            }
        });
    });
});

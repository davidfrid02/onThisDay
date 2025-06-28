const { describe, it, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("TwitterApiService", () => {
    let TwitterApiService, TwitterApiStub, uploadMediaStub, tweetStub, consoleStub;

    beforeEach(() => {
        uploadMediaStub = sinon.stub();
        tweetStub = sinon.stub();
        TwitterApiStub = sinon.stub().returns({
            v1: { uploadMedia: uploadMediaStub },
            v2: { tweet: tweetStub },
        });
        TwitterApiService = proxyquire("./twitterApiService", {
            "twitter-api-v2": { TwitterApi: TwitterApiStub },
        });
        consoleStub = sinon.stub(console, "error");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("constructor", () => {
        it("should initialize TwitterApi with correct keys", () => {
            const keys = {
                appKey: "k",
                appSecret: "s",
                accessToken: "t",
                accessSecret: "x",
            };
            const service = new TwitterApiService(keys.appKey, keys.appSecret, keys.accessToken, keys.accessSecret);
            expect(TwitterApiStub.calledOnceWith(keys)).to.be.true;
            expect(service.twitter.v1).to.exist;
            expect(service.twitter.v2).to.exist;
        });
    });

    describe("postTweet", () => {
        it("should upload media and tweet, returning the tweet", async () => {
            uploadMediaStub.resolves("media-id");
            tweetStub.resolves({ id: "tweet-id", text: "tweet!" });
            const service = new TwitterApiService("a", "b", "c", "d");
            const result = await service.postTweet(Buffer.from([1, 2]), "hello");
            expect(uploadMediaStub.calledOnce).to.be.true;
            expect(tweetStub.calledOnce).to.be.true;
            expect(result).to.deep.equal({ id: "tweet-id", text: "tweet!" });
        });

        it("should throw and log if uploadMedia fails", async () => {
            uploadMediaStub.rejects(new Error("fail-upload"));
            const service = new TwitterApiService("a", "b", "c", "d");
            try {
                await service.postTweet(Buffer.from([1]), "fail");
                throw new Error("Should have thrown");
            } catch (err) {
                expect(err.message).to.equal("fail-upload");
                expect(consoleStub.calledOnce).to.be.true;
            }
        });

        it("should throw and log if tweet fails", async () => {
            uploadMediaStub.resolves("media-id");
            tweetStub.rejects(new Error("fail-tweet"));
            const service = new TwitterApiService("a", "b", "c", "d");
            try {
                await service.postTweet(Buffer.from([1]), "fail");
                throw new Error("Should have thrown");
            } catch (err) {
                expect(err.message).to.equal("fail-tweet");
                expect(consoleStub.calledOnce).to.be.true;
            }
        });
    });
});

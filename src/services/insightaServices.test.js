const { describe, it, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const axios = require("axios");
const InsightaServices = require("./insightaServices");

describe("InsightaServices", () => {
    let insightaServices;
    let axiosStub;
    let consoleStub;

    beforeEach(() => {
        insightaServices = new InsightaServices();
        axiosStub = sinon.stub(axios, "get");
        consoleStub = sinon.stub(console, "log");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("constructor", () => {
        it("should initialize with correct URL", () => {
            expect(insightaServices.url).to.equal("https://history.muffinlabs.com/date");
        });
    });

    describe("getTodayFact", () => {
        it("should return a formatted fact when API call succeeds", async () => {
            const mockResponse = {
                data: {
                    data: {
                        Events: [
                            { year: 1492, text: "Christopher Columbus discovered America" },
                            { year: 1776, text: "Declaration of Independence was signed" },
                        ],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(axiosStub.calledOnceWith("https://history.muffinlabs.com/date")).to.be.true;
            expect(result).to.match(/^\d{4}: .+/);
            expect(consoleStub.calledOnce).to.be.true;
        });

        it("should truncate fact if longer than 250 characters", async () => {
            const longText = "A".repeat(300);
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ year: 1492, text: longText }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result.length).to.equal(250);
            expect(result).to.include("...");
        });

        it("should not truncate fact if shorter than 250 characters", async () => {
            const shortText = "Short event";
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ year: 1492, text: shortText }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.equal("1492: Short event");
            expect(result.length).to.be.lessThan(250);
        });

        it("should handle exact 250 character fact", async () => {
            const exactText = "A".repeat(244);
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ year: 1492, text: exactText }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.equal("1492: " + exactText);
            expect(result.length).to.equal(250);
        });

        it("should return null when API call fails", async () => {
            const error = new Error("Network error");
            axiosStub.rejects(error);

            const result = await insightaServices.getTodayFact();

            expect(result).to.be.null;
        });

        it("should handle empty events array", async () => {
            const mockResponse = {
                data: {
                    data: {
                        Events: [],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.be.null;
        });

        it("should handle missing data structure", async () => {
            const mockResponse = {
                data: {},
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.be.null;
        });

        it("should handle null response", async () => {
            axiosStub.resolves(null);

            const result = await insightaServices.getTodayFact();

            expect(result).to.be.null;
        });

        it("should handle undefined response", async () => {
            axiosStub.resolves(undefined);

            const result = await insightaServices.getTodayFact();

            expect(result).to.be.null;
        });

        it("should handle event with missing year", async () => {
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ text: "Event without year" }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.equal("undefined: Event without year");
        });

        it("should handle event with missing text", async () => {
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ year: 1492 }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.equal("1492: undefined");
        });

        it("should handle event with null values", async () => {
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ year: null, text: null }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.equal("null: null");
        });

        it("should handle event with empty string values", async () => {
            const mockResponse = {
                data: {
                    data: {
                        Events: [{ year: "", text: "" }],
                    },
                },
            };

            axiosStub.resolves(mockResponse);

            const result = await insightaServices.getTodayFact();

            expect(result).to.equal(": ");
        });

        it("should handle multiple API calls and return different facts", async () => {
            const mockResponse1 = {
                data: {
                    data: {
                        Events: [
                            { year: 1492, text: "First event" },
                            { year: 1776, text: "Second event" },
                        ],
                    },
                },
            };

            const mockResponse2 = {
                data: {
                    data: {
                        Events: [
                            { year: 1945, text: "Third event" },
                            { year: 1969, text: "Fourth event" },
                        ],
                    },
                },
            };

            axiosStub.onFirstCall().resolves(mockResponse1);
            axiosStub.onSecondCall().resolves(mockResponse2);

            const result1 = await insightaServices.getTodayFact();
            const result2 = await insightaServices.getTodayFact();

            expect(result1).to.not.equal(result2);
            expect(axiosStub.calledTwice).to.be.true;
        });
    });
});

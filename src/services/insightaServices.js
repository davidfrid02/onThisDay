const axios = require("axios");

class InsightaServices {
    constructor() {
        this.url = "https://history.muffinlabs.com/date";
    }

    async getTodayFact() {
        try {
            const { data } = await axios.get(this.url);
            const events = data.data.Events;

            const randomIndex = Math.floor(Math.random() * events.length);
            const randomEvent = events[randomIndex];
            let fact = `${randomEvent.year}: ${randomEvent.text}`;

            if (fact.length > 280) {
                fact = fact.slice(0, 277) + "...";
            }
            console.log(`Today fact: ${fact}\n`);
            return fact;
        } catch (error) {
            console.error("Failed to fetch event:", error.message);
            return null;
        }
    }
}

module.exports = InsightaServices;

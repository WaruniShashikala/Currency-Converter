const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// Get all currencies
app.get("/getAllCurrencies", async (req, res) => {
    const nameURL = "https://openexchangerates.org/api/currencies.json?app_id=ee85abc95bbb4b32ad417c276bcb50f5";

    try {
        const namesResponse = await axios.get(nameURL);
        const nameData = namesResponse.data;
        return res.json(nameData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch currencies" });
    }
});

// Convert currency
app.get("/convert", async (req, res) => {
    const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } = req.query;

    try {
        const dataUrl = `https://openexchangerates.org/api/historical/${date}.json?app_id=ee85abc95bbb4b32ad417c276bcb50f5`;
        
        const dataResponse = await axios.get(dataUrl);
        const rates = dataResponse.data.rates;

        // Get conversion rates
        const sourceRate = rates[sourceCurrency];
        const targetRate = rates[targetCurrency];

        if (!sourceRate || !targetRate) {
            return res.status(400).json({ error: "Invalid currency codes" });
        }

        // Calculate target currency amount
        const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

        return res.json(targetAmount);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Conversion failed" });
    }
});

// Listen on port 5000
app.listen(5000, () => {
    console.log("SERVER STARTED on port 5000");
});

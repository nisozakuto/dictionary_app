const axios = require("axios");
require("dotenv").config();

export async function handler(event, context) {
  const word = event.queryStringParameters.word || "automobile";

  try {
    const response = await axios({
      method: "GET",
      url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": process.env.APIKEY,
      },
    });
    let results = [];

    response.data.results.map((def) => {
      let definitionArray = [];
      const keys = Object.keys(def);
      keys.map((key) => {
        const regex = /(?=[A-Z])/;
        const label = key.split(regex).join(" ").toLowerCase();
        const value = def[key];
        let newObj = {
          label,
          value,
          isString: typeof value === "string" ? true : false,
        };
        definitionArray.push(newObj);
      });
      results.push(definitionArray);
    });
    return {
      statusCode: 200,
      body: JSON.stringify(results),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
}

const fetch = require('node-fetch');
const { BEARER_TOKEN } = process.env;

exports.handler = async (event, context) => {
    try{
        const tweetId = event.queryStringParameters.id;
        const rawResponse = await fetch(`https://api.twitter.com/1.1/statuses/lookup.json?id=${tweetId}&include_ext_alt_text=true&trim_user=true&tweet_mode=extended`, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`
            }
        });
        const tweetData = await rawResponse.json();
        const images = tweetData[0]?.extended_entities?.media;
        
        if (images) {
            const alts = [];
            images.forEach(image => {
                if ('ext_alt_text' in image) {
                    alts.push(image.ext_alt_text);
                }
            });

            return {
                statusCode: 200,
                body: JSON.stringify(alts)
            };
        }
        
        return {
            statusCode: 204
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: `Whoops! Something went wrong -> ${err}`
        }
    }
};
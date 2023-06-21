const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt = "Hello world";
// https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
const max_tokens = 4097 - prompt.length;

try {
    const res = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "It was the best of times",
        max_tokens,
        temperature: 0,
        stream: true,
    }, { responseType: 'stream' });
    
    res.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
                return; // Stream finished
            }
            try {
                const parsed = JSON.parse(message);
                console.log(parsed.choices[0].text);
            } catch(error) {
                console.error('Could not JSON parse stream message', message, error);
            }
        }
    });
} catch (error) {
    if (error.response?.status) {
        console.error(error.response.status, error.message);
        error.response.data.on('data', data => {
            const message = data.toString();
            try {
                const parsed = JSON.parse(message);
                console.error('An error occurred during OpenAI request: ', parsed);
            } catch(error) {
                console.error('An error occurred during OpenAI request: ', message);
            }
        });
    } else {
        console.error('An error occurred during OpenAI request', error);
    }
}
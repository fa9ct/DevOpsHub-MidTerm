const express = require('express');
const redis = require('redis');
const app = express();

app.use(express.urlencoded({ extended: true }));

const client = redis.createClient({
    url: 'redis://redis-db:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

app.get('/', async (req, res) => {
    
    await client.incr('page_visits');
    
    
    res.send(`
        <h2>DevOpsHub: Send us your feedback</h2>
        <form method="POST" action="/send">
            <textarea name="message" rows="4" cols="50" required></textarea><br><br>
            <input type="submit" value="Send Message">
        </form>
    `);
});

app.post('/send', async (req, res) => {
    const message = req.body.message;
    if (message) {
        await client.rPush('messages_list', message);
        res.send('<h3>Message sent successfully!</h3><a href="/">Go Back</a>');
    }
});

app.listen(5000, () => console.log('App 1 running on port 5000'));
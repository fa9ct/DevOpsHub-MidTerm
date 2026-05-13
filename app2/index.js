const express = require('express');
const redis = require('redis');
const app = express();

// الاتصال بنفس قاعدة بيانات Redis
const client = redis.createClient({
    url: 'redis://redis-db:6379'
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

app.get('/', async (req, res) => {
    // جلب عدد الزيارات وإجمالي الرسائل من Redis
    const visits = await client.get('page_visits') || 0;
    const msgCount = await client.lLen('messages_list') || 0;

    res.send(`
        <h2>DevOpsHub: Dashboard</h2>
        <h3>Total Visits to Message Page: <span style="color:blue">${visits}</span></h3>
        <h3>Total Messages Collected: <span style="color:green">${msgCount}</span></h3>
        <br>
        <button onclick="location.reload()">Refresh Data</button>
    `);
});

app.listen(5000, () => console.log('App 2 running on port 5000'));
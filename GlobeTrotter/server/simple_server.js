const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('It works!'));

app.listen(3001, () => {
    console.log('Simple server running on 3001');
});

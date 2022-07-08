/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const app = require('./controller/app');
require('dotenv').config();
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log('Web App Hosted at http://localhost:%s',PORT);
})
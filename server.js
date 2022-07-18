/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const app = require('./controller/app');
require('dotenv').config();
const PORT = process.env.PORT
const HOST = process.env.HOST

const server = app.listen(PORT, () => {
    console.log(`Web App Hosted at http://${HOST}:${PORT}/`);
})
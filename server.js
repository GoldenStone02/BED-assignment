/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const app = require('./controller/app');
require('dotenv').config();
const PORT = process.env.PORT
const HOST = process.env.HOST
const serveStatic = require('serve-static'); // To provide the public content
const path = require('path'); // To provide the path to the public content

app.use(serveStatic(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
    console.log(`Web App Hosted at http://${HOST}:${PORT}/`);
})
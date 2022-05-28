/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const app = require('./controller/app');
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log('Web App Hosted at http://localhost:%s',PORT);
})
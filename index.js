import app from './src/app'


const port = process.env.PORT || 3000;

// app configurations
app.set('port', port);

// establish http server connection
app.listen(port, () => { console.log(`App running on port ${port}`) });
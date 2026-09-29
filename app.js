//imports the Express library
const express = require("express");

//import mongoose package
const mongoose = require("mongoose");

//import path module
const path = require("path");

// import the record model
const Records = require("./models/records");

//Creates an instance of an Express application. This object will handle incoming requests and define responses.
const app = express();

//EJS variable for nav
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
//set port to 3000
const PORT = 3000;

//EJS for imbeding as the view engine
app.set("view engine", "ejs");

//express setup
app.use(express.json());//parse JSON data
app.use(express.urlencoded({ extended: true }));//parse form data from html
app.use(express.static('public'));//access and usage static assets(css,image,js)
app.set('views', path.join(__dirname, 'views'));//tells express the location of the views folder

//local mongoose connection,connect to MongoDB
mongoose.connect("mongodb://localhost:27017/recordDB")
    .then(() => console.log('MongoDB connected'))//display if connection is successful
    .catch(err => console.error('MongoDB connection error:', err)); //display if connection was unsuccesful

//Middleware to allow reuse of functionality:
//prevent errors that will block chart.js,bootstrap,scripts,images or styles
app.use((_, res, next) => {//apply middleware to all routes
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; " +
        "style-src 'self' https://cdn.jsdelivr.net https://cdn.jsdelivr.net/npm https://fonts.googleapis.com 'unsafe-inline'; " +
        "font-src 'self' data: https://fonts.googleapis.com; " +
        "connect-src 'self' https://cdn.jsdelivr.net; " +
        "img-src 'self' data: https://cdn.jsdelivr.net; ");
    next();


});

//API routes: 
//handle GET request to fetch records from MongoDB as JSON for chart
app.get('/api/records', async (_req, res) => {
    try { res.json(await Records.find().lean()); }//lean() converts Records into JS objects
    catch (e) {
        console.error("Error fetching records:", e);
        res.status(500).json({ error: e.message })
    }// return error message there's server failure

});

//handle GET request to fetch chart data
app.get('/api/chart-data', async (_req, res) => {
    try {
        //MongoDB aggregation
        const data = await Records.aggregate([
            { $group: { _id: '$year', count: { $sum: 1 } } }, //group by year
            { $project: { year: '$_id', count: 1, _id: 0 } }//rename fields
        ]);
        res.json(data); //aggregated data sent to chart.ejs
    } catch (e) { res.status(500).json({ error: e.message }); }// return error message there's server failure

});

//HTML pages:
//handle GET request to fetch index.ejs page and show all records
app.get('/', async (_req, res) => {
    const records = await Records.find().lean();//convert records from mongoose documents to JS objects
    //render index.ejs
    res.render('index', { title: "Home", records }); //allow EJS to loop over records
});

//predictions page(add page)
//handle GET request to fetch a predictions.ejs for new records to be added
app.get('/predictions', (_req, res) => {
    //render predictions.ejs
    res.render('predictions', { title: "Predictions", })
});

//form to edit existing records
//:id is a route parameter for MongoDB id
//handle GET request to fetch editRecord.ejs
app.get('/editRecords/:id', async (req, res) => {
    //get record by it's id
    try {
        const record = await Records.findById(req.params.id).lean();//convert record from mongoose documents to JS objects
        //display  if record is not found
        if (!record) return res.status(404).send('Not found');
        //render editPredictions
        res.render('editRecords', { title: "Edit Records", record });
    } catch (e) {
        console.error("Error retrieving record:", e);
        res.status(400).send("Error retrieving record");//failed to load record for editing
    }
});

//handle GET request to fetch chart.ejs page
app.get('/chart', (_req, res) => res.render('chart', { title: 'Chart' }));

//FORM's CRUD
// handle create POST requests
app.post('/records', async (req, res) => {
    //form data for year,wins,losses,seed,playoffFinish,expectedW-L
    try { await Records.create(req.body); res.redirect('/'); }//redirect to index page after successful insert
    catch (err) {

        res.status(400).send("error creating record:" + err.message);
    }//for bad input or failded validation
});

// handle update POST requests
app.post('/records/:id', async (req, res) => {
    //find record by its MongoDB id and update it with form data
    console.log('Updating record with id:', req.params.id);
    try {
        //runValidators ensure schema rules are followed
        const updatedRecord = await Records.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        //display if record not found
        if (!updatedRecord) return res.status(404).send("Record not found");
        res.redirect('/');//redirect to index page after successful update
    } catch (err) {
        console.error("Error while updating follow format")
        res.status(400).send("Error while updating record: " + err.message);//for bad input or failded validation
    }
});

//to handle delete POST request
app.post('/delete/:id', async (req, res) => {
    //delete record using it's MongoDB id
    console.log('Deleting record with ID:', req.params.id);
    try {
        const deletedRecord = await Records.findByIdAndDelete(req.params.id);
        //display error if record not found
        if (!deletedRecord) return res.status(404).send("Record not found");
        res.redirect('/');//redirect to index page after successful delete
    } catch (e) { res.status(400).send("Error occured while deleting record" + err.message); }//for bad input or failed deltion
});

//if unknown routes used
app.use((_req, res) => {
    res.status(404).render('404', { title: "Page Not Found" });

});
//start server and send confirmation message if successful
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
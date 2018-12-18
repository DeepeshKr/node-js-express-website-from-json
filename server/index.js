const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyparser = require('body-parser');
const configs = require('./config');
const SpeakerService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');

const app = express();

const config = configs[app.get('env')];

// fetch data from files
const speakerService = new SpeakerService(config.data.speakers);
const feedbackService = new FeedbackService(config.data.feedback);

// change the view engine to anything else you want pug => HAML
app.set('view engine', 'pug');

if(config === 'development') {
    app.locals.pretty = true;
}

app.set('views', path.join(__dirname, './views'));

app.locals.title = config.sitename;

app.use((req, res, next) => {
    res.locals.rendertime = new Date();
    return next();
})

app.use(bodyparser.urlencoded({extended: true}));

const routes = require('./routes');

// use all assets from public folder
app.use(express.static('public'));

app.get('/favicon.ico', (req,res, next) => {
    return res.sendStatus(204);
});

app.use(async(req, res, next) => {
    try{
        const names = await speakerService.getNames();
        // console.log(names);
        res.locals.speakerNames = names;
        return next();
    } catch(err) {
        return next(err);
    }
})

//all routes listed from here and within folder
app.use('/', routes({
    speakerService,
    feedbackService,
}));

// 404 error for file not found
app.use((req, res, next) => {
    return next(createError(404, "File not found"));
});

//error page
app.use((error, req, res, next) => {
    res.locals.message = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    res.status(status);
   return res.render('error');
});

app.listen(3000);

module.export = app;
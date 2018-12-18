const express = require('express');
const router = express.Router();

module.exports = (param) => {

    const {speakerService} = param;
    const {feedbackService} = param;

    router.get('/', async (req, res, next) => {
        try {
            const promises = [];

            promises.push(speakerService.getList());
            promises.push(speakerService.getAllArtwork());

            const results = await Promise.all(promises);
            // const speakerslist =  await speakerService.getList();
            const feedbacklist = await feedbackService.getList();
            const speakerslist =  await speakerService.getList();
            console.log(`Param from speaker ${JSON.stringify(feedbacklist)}`)
            console.log(`Param from speaker ${JSON.stringify(speakerslist)}`)

            return res.render('speakers', {
                page: 'All Speakers',
                speakerslist: results[0],
                artwork: results[1],
            });
        } catch(err) {
            return next(err)
        }

    })

    

    router.get('/:name', async (req, res, next) => {
        try {
            const promises = [];

            promises.push(speakerService.getSpeaker(req.params.name));
            promises.push(speakerService.getArtworkForSpeaker(req.params.name));

            const results = await Promise.all(promises);

            if (!results[0]) {
                return next();
            }

            return res.render('speakers/detail', {
                page: 'detail',
                speaker: results[0],
                artwork: results[1],
            });
        } catch(err){
            return next(err)
        }
        
    })

    return router;
}
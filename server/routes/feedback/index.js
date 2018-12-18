const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { feedbackService } = param;

    router.get('/', async (req, res, next) => {
        try {
            const feedbacklist = await feedbackService.getList(); 
            
            return res.render('feedback', {
                page: 'Feedback',
                feedbacklist,
                success: req.query.success,
                
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            const feedbacklist = await feedbackService.getList(); 
        console.log(req.body);
        const fbName = req.body.fbname.trim();
        const fbTitle = req.body.fbtitle.trim();
        const fbMessage = req.body.fbmessage.trim();

        if (!fbName || !fbTitle || !fbMessage) {
            return res.render('feedback', {
                page: 'Feedback',
                error: true,
                fbName,
                fbMessage,
                fbTitle,
                feedbacklist,
            });
        }
        console.log(`bName fbTitle fbMessage`)
        //await feedbackService.addEntry(fbName, fbTitle, fbMessage);
        return res.redirect('/feedback?success=true');
        }
        catch(err) {
            return err;
        }
    });

    return router;
};
module.exports = {
    

    async servicePage(req, res) {
        try {
            res.render('ServicePage');
        } catch (err) {
            res.send(err);
        }
    },
}

class IndexController {
    showIndex(req, res) {
        res.render("index", {layout: "layout"});
    }

    postUser(req, res, next) {
        req.session.user.nickname = req.body.nickname;
        res.redirect(`/${req.query.route}`);
    }

    showJoin(req, res) {
        res.render("join", {layout: "layout"});
    }

    showHost(req, res) {
        res.render("host", {layout: "layout"});
    }
}

export const indexController = new IndexController();
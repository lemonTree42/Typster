class IndexController {
    showIndex(req, res) {
        res.render("index", {layout: "layout", title: "Typster"});
    }
}

export const indexController = new IndexController();
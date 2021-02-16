export const sessionUserSettings = (req, res, next) => {
    req.session.user = req.session.user || {nickname: "", gameId: -1};
    next();
};
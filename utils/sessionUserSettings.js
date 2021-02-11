export const sessionUserSettings = (req, res, next) => {
    req.session.user = req.session.user || {nickname: "", playerId: -1};
    next();
};
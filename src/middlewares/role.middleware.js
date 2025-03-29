export function adminOnly(req, res, next) {
    if (req.userRole !== 'admin') {
        return res.status(403).send({ message: "Access denied" });
    }
    next();
}

export function sameUserOrAdmin(req, res, next) {
    if (req.userId != req.params.id && req.userRole !== 'admin') {
        return res.status(403).send({ message: "Access denied" });
    }
    next();
}
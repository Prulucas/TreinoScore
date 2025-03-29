export function validId(req, res, next) {
    const idParams = req.params.id || req.userId;

    if (!idParams || isNaN(idParams)) {
        return res.status(400).send({ message: "Invalid id!" });
    }
    next();
}
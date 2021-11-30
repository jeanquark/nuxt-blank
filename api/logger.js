export default function(req, res, next) {
    // req est l'objet de la requête http de Node.js
    // console.log(`[serverMiddleware] /api/logger ${new Date()} req.url: ${req.url}`)

    // res est l'objet de réponse http de Node.js

    // next est une fonction à appeler pour invoquer le prochain middleware
    // N'oubliez pas d'appeler le suivant à la fin si votre middleware n'est pas un endpoint !
    next()
}

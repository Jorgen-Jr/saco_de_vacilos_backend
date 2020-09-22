const jwt = require('jsonwebtoken');
import { NextFunction, Request, Response } from 'express';
import SESSION_SECRET from '../util/secrets';

module.exports = ( req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({ error : 'No token provided' });
    }

    const parts: Array<string> = authHeader.split(' ');

    if(!(parts.length === 2)){
        return res.status(401).send({ error: 'Token error '});
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token malformatted' });
    }

    jwt.verify(token, SESSION_SECRET, (err: String, decoded:any) => {
        if(err){
            return res.status(401).send({ error: 'Token invalid'});
        }
        req.params.user_id = decoded.id;

        return next();
    });

};
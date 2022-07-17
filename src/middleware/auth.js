import jwt from 'jsonwebtoken';
import Return from '../utils/Return.js';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_KEY);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        if (!req.userId) return Return.unauthorized(res);

        next();
    } catch (err) {
        Return.error500(res, err.message);
    }
};

export default auth;

//usage
//import auth from './middleware/auth'
//at routes
//router.post('/dosomething', auth, dosomething)

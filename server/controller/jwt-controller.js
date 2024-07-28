import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Corrected split parameter

    if(token == null){
        return response.status(401).json({ msg: 'Token is missing' }); // Modified error message
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => { // Added error parameter
        if(error){
            return response.status(403).json({ msg: 'Invalid token' }); // Modified error message
        }

        request.user = user;
        next();
    });
};

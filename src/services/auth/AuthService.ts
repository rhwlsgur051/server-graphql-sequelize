import db from '../../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthError } from '../../common/AuthError';
import { Service } from 'typedi';

@Service()
export class AuthService {
    auth = async (body: { email: string, password: string }) => {
        // 이메일로 사용자 조회
        const user = await db.User.findOne(
            {
                where: {
                    email: body.email
                }
            })

        if (!user) {
            throw new AuthError().AU001;
        }
        const isCorrect = await bcrypt.compareSync(body.password, user.password)

        if (!isCorrect) {
            throw new AuthError().AU001;
        }

        const token = jwt.sign({
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET_KEY || '')
        return {
            token,
            name: user.name,
            id: user.id,
            email: user.email,
        }
    }
}
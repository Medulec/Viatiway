import bcrypt from  'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma';
import { Router, Request, Response } from 'express'

const router = Router();

router.post('/login', async (req: Request, res: Response) =>{
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Brak danych"})
    }
    const user = await prisma.user.findUnique({ where: { email }})
    const isPasswordValid = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false

    if (!user || !isPasswordValid) {
        return res.status(401).json({ message: "Nieprawidłowe dane logowania" })
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, accessLevel: user.accessLevel }, process.env.JWT_SECRET!, { expiresIn: '12h'}
    )

    return res.status(200).json( { token } )
} )

export default router;
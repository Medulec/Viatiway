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
    if (!user) {
        return res.status(401).json({ message: "Nie znaleziono użytkownika"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Nieprawidłowe hasło" })
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.accessLevel }, process.env.JWT_SECRET!, { expiresIn: '12h'}
    )

    return res.status(200).json( { token } )
} )

export default router;
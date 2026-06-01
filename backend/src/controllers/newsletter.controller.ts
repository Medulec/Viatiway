import { Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'

const schema = z.object({
  email: z.email(),
})

export async function subscribeHandler(req: Request, res: Response): Promise<void> {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ message: 'Nieprawidłowy adres e-mail' })
    return
  }

  try {
    await prisma.newsletterSubscriber.create({ data: { email: result.data.email } })
    res.status(201).json({ message: 'Zapisano' })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(200).json({ message: 'Już jesteś na liście' })
      return
    }
    res.status(500).json({ message: 'Błąd serwera' })
  }
}

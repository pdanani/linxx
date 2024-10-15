// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { title, description } = req.body;
    try {
      const newEvent = await prisma.event.create({
        data: {
          title,
          description,
          hostId: session.user.id,
          status: 'draft',
        },
      });
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

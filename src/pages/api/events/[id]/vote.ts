// pages/api/events/[id]/vote.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const { id } = req.query;

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { votes } = req.body; // Array of { eventDateId, availability }

    try {
      // Upsert votes
      await Promise.all(
        votes.map(async (vote: any) => {
          await prisma.vote.upsert({
            where: {
              eventDateId_userId: {
                eventDateId: vote.eventDateId,
                userId: session.user.id,
              },
            },
            update: {
              availability: vote.availability,
            },
            create: {
              eventDateId: vote.eventDateId,
              userId: session.user.id,
              availability: vote.availability,
            },
          });
        })
      );

      res.status(200).json({ message: 'Votes submitted successfully' });
    } catch (error) {
      console.error('Error submitting votes:', error);
      res.status(500).json({ error: 'Error submitting votes' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

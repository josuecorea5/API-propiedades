import { Response } from 'express';
import { prisma } from '../config/db';
import { RequestWithUserId } from '../middlewares/isAuthenticated';

export class MessageController {
  public async getMessagesOfProperty(req: RequestWithUserId, res: Response) {
    
    const { id } = req.params;
    const userId = req.userId;

    try {
     const property = await prisma.property.findFirst({ where: { id }});
     if(!property) {
      return res.status(404).json({ message: 'Property not found', error: true });
     }

     if(property.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized', error: true });
     }

     const messages = await prisma.message.findMany({where: { propertyId: id}, include: { user: {select: {
      id: true,
      name: true,
      email: true,
     }} }});

      return res.status(200).json(messages);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error getting messages', error: true });
    }
  }
}

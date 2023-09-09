import { Response } from "express";
import { prisma } from "../config/db";
import { RequestWithUserId } from "../middlewares/isAuthenticated";
import { uploadImage } from '../utils/cloudinary';

export class PropertyController {
  public async getProperties(req: RequestWithUserId, res: Response) {
    try {
      let { page } = req.query;

      const regexOnlyNumbers = /^[0-9]$/
  
      if(!regexOnlyNumbers.test(page as string)) {
        page = '1';
      }
      
      const take = 10;
      const skip = ((Number(page) * take) - take)

      const [properties, totalProperties] = await Promise.all([
        prisma.property.findMany(
          {where: {userId: req.userId }, skip, take,include: {
          category: true,
          price: true,
          user: true,
          messages: true
        }}),
        prisma.property.count({where: {userId: req.userId}})
      ])
      
      res.json({
        properties,
        totalPages: Math.ceil(totalProperties / take),
        currentPage: Number(page),
        total: totalProperties,
        offset: skip,
        limit: take
      })
    } catch (error) {
      console.log(error)
    }

  }

  public async getThreeLatestProperties(req: RequestWithUserId, res: Response) {
    try {

      const properties = await prisma.property.findMany(
        { where:  { published: true}, take: 3, include: {price: true}, orderBy: { createdAt: 'desc'}}
      )

      res.json(properties)

    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener propiedades' })
    }
  }

  public async searchProperties(req: RequestWithUserId, res: Response) {
    const { title } = req.query;

    if(!title?.toString().trim()) {
      return res.status(400).json({ message: 'Titulo es requerido' })
    }

    try {
      const properties = await prisma.property.findMany({ where: { title: { contains: title.toString().trim()}, published: true}, include: {
        price: true,
      }})
      res.json(properties)
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener propiedades' })
    }
  }

  public async getNews(req: RequestWithUserId, res: Response) {
    try {
      const properties = await prisma.property.findMany({ where: { published: true}, include: {
        category: true,
        price: true,
      }})
      res.json(properties)
    } catch (error) {
      console.log(error)
    }
  }

  public async getPropertyPublished(req: RequestWithUserId, res: Response) {
    const { id } = req.params;
    const properties = await prisma.property.findFirst({ where: { id },  include: {
      category: true,
      price: true,
    }})

    if(!properties || !properties.published) {
      return res.status(404).json({ message: 'Propiedad no encontrada', error: true })
    }

    res.json(properties)
  }

  public async createProperty(req: RequestWithUserId, res: Response) {
    const newProperty = req.body;
    
    if(!req.file?.filename) {
      return res.status(400).json({ message: 'Imagen es requerida' })
    }

    try {
      const response =  await uploadImage(req.file.path)
      newProperty.image = response.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Error al subir imagen' })
    }

    newProperty.bedrooms = Number(newProperty.bedrooms);
    newProperty.bathrooms = Number(newProperty.bathrooms);
    newProperty.garages = Number(newProperty.garages);
    newProperty.priceId = Number(newProperty.priceId);
    newProperty.userId = req.userId;
    newProperty.categoryId = Number(newProperty.categoryId);
    newProperty.published = true;

    try {
      const property = await prisma.property.create({ data: newProperty})
      res.status(201).json(property)
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error al crear propiedad' })
    }

  }

  public async getProperty(req: RequestWithUserId, res: Response) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const property = await prisma.property.findFirst( { where: { id }});
      if(!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' })
      }
      if(property.userId !== userId) {
        return res.status(401).json({ message: 'No autorizado' })
      }
      res.json(property);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error obtener la propiedad' })
    }
  }

  public async sendMessagetoSeller(req: RequestWithUserId, res: Response) {
    const userId = req.userId;
    const { id } = req.params;
    const { message } = req.body;
    try {

      const property = await prisma.property.findFirst( { where: { id }});
      if(!property) {
        return res.status(404).json({ 
          error: true,
          message: 'Propiedad no encontrada'
         })
      };

      if(property.userId === userId) {
        return res.status(400).json({ 
          error: true,
          message: 'No puedes enviar mensajes a tus propiedades'
         })
      }

      await prisma.message.create({ data: { message, userId: Number(userId), propertyId: id}})
      res.json({
        message: 'Mensaje enviado'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error al enviar mensaje' })
    }
  }

  public async updateProperty(req: RequestWithUserId, res: Response) {

    const propertyToUpdate = req.body;

    const { id } = req.params;
    const userId = req.userId;

    try {
      const property = await prisma.property.findFirst( { where: { id }});
      if(!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' })
      }
      if(property.userId !== userId) {
        return res.status(401).json({ message: 'No autorizado' })
      }

      if(propertyToUpdate.image) {
        if(propertyToUpdate.image === property.image) {
          propertyToUpdate.image = property.image;
        }else {
          return res.status(400).json({ message: 'Imagen no puede ser actualizada' })
        }
      }else {
        if(req.file?.filename) {
          try {
            const response =  await uploadImage(req.file.path)
            propertyToUpdate.image = response.secure_url;
          } catch (error) {
            return res.status(500).json({ message: 'Error al subir imagen' })
          }
        }else {
          return res.status(400).json({ message: 'Imagen es requerida' })
        }
      }

      propertyToUpdate.bedrooms = Number(propertyToUpdate.bedrooms);
      propertyToUpdate.bathrooms = Number(propertyToUpdate.bathrooms);
      propertyToUpdate.garages = Number(propertyToUpdate.garages);
      propertyToUpdate.priceId = Number(propertyToUpdate.priceId);
      propertyToUpdate.categoryId = Number(propertyToUpdate.categoryId);

      const updatedProperty = await prisma.property.update({ where: { id}, data: propertyToUpdate})

      res.json(updatedProperty)
      

    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar propiedad' })
    }
  }

  public async updatePropertyPublished(req: RequestWithUserId, res: Response) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const property = await prisma.property.findFirst( { where: { id }});
      if(!property) {
        return res.status(404).json( { message: 'Propiedad no encontrada', error: true});
      }

      if(property.userId != userId) {
        return res.status(401).json({ message: 'No autorizado', error: true})
      }

      await prisma.property.update( { where: { id}, data: { published: !property.published}})

      res.json( { updated: true })

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error al actualizar propiedad', error: true})
    }
  }

  public async deleteProperty(req: RequestWithUserId, res: Response) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const property = await prisma.property.findFirst( { where: { id }});
      if(!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' })
      }

      if(property.userId !== userId) {
        return res.status(401).json({ message: 'No autorizado' })
      }

      await prisma.property.delete({ where: { id }})

      res.status(204).json()
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar propiedad' })
    }
  }
}

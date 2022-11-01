import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getCart(userId: string) {
  try {
    const cart =
      await prisma.$queryRaw`SELECT c.id, userId, quantity, productId, amount, price, name, image_url FROM Cart as c Join products as p WHERE c.productId=p.id AND c.userId=${userId};`
    // if (cart && cart.length > 0) {
    //   return cart
    // }
    console.log(cart)
    return cart
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  message: string
  items?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session == null) {
      res.status(200).json({ items: [], message: `no Session` })
      return
    }
    const wishList = await getCart(String(session.id))
    res.status(200).json({ items: wishList, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}

import { User } from '@repo/db/client'
import { BaseRepository } from './baseRepository'
import prisma from '../lib/db'

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user)
  }

  // Add any user-specific methods here

  // This method is used to find a single user by a condition
  async findUser(where: Partial<User>): Promise<User | null> {
    return prisma.user.findFirst({ where })
  }
}

export { UserRepository }

import { UserRepository } from './userRepository'

class RepositoryWrapper {
  userRepository: UserRepository
  // Add other repositories here

  constructor() {
    this.userRepository = new UserRepository()
    // Initialize other repositories here
  }
}

export const repositoryWrapper = new RepositoryWrapper()

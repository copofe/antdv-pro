import { Usecase } from './_shared'
import { userRepo } from '::/repositories/user'

class UserAuthUsecase extends Usecase {
  constructor() {
    super()
  }

  async initialize() {
    const user = await userRepo.getCurrentUser()

    return {
      user,
    }
  }

  login = async (...args: Parameters<typeof userRepo['generateToken']>) => {
    const token = await userRepo.generateToken(...args)
    const { user } = await this.initialize()

    return {
      token,
      user,
    }
  }

  logout = async () => {
    await userRepo.invalidateToken()
  }
}

export const userAuthUsecase = new UserAuthUsecase()

declare namespace Express {
  interface Request {
    user?: {
      id:          string
      name:        string
      email:       string
      accessLevel: string
    }
  }
}

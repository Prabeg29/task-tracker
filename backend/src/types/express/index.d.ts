declare namespace Express {
  export interface Request {
    role: string;
  }
}

declare namespace Express {
  export interface Request {
    currentUser: {
      id: number;
      email: string;
      role: string;
    };
  }
}

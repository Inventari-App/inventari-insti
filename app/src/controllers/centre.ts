import { Request, Response } from "express";

export const index = async (_req: Request, res: Response) => {
  res.render("centre");
};


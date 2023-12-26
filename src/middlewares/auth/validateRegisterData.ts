import { NextFunction, Request, Response } from "express";

export const validateRegisterData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (first_name === "" || first_name === null || first_name === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "El campo nombre es obligatorio." });
  }
  if (last_name === "" || last_name === null || last_name === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "El campo apellido es obligatorio." });
  }
  if (email === "" || email === null || email === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "El campo de email es obligatorio." });
  }
  if (age === 0 || age === null || age === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "El campo edad es obligatorio." });
  }
  if (password === "" || password === null || password === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "El campo de contraseña es obligatorio." });
  }

  next();
};

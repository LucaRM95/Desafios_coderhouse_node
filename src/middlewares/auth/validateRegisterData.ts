import { NextFunction, Request, Response } from "express";

export const validateRegisterData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, email, age, password } = req.body;

  if(first_name === '' || first_name === null || first_name === undefined){
    res.render("register", { message: "El campo nombre es obligatorio." }) 
  }
  if(last_name === '' || last_name === null || last_name === undefined){
    res.render("register", { message: "El campo apellido es obligatorio." }) 
  }
  if(email === '' || email === null || email === undefined){
    res.render("register", { message: "El campo de email es obligatorio." }) 
  }
  if(age === 0 || age === null || age === undefined){
    res.render("register", { message: "El campo edad es obligatorio." }) 
  }
  if(password === '' || password === null || password === undefined){
    res.render("register", { message: "El campo de contraseña es obligatorio." }) 
  }

  next();
};

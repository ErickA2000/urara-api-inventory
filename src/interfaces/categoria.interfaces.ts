import { Document } from "mongoose";

export interface ICategoria{
    nombre?: string,
    descripcion?: string,
    estado?: string
}

export interface ICategoriaDocument extends Document{
    nombre: string,
    descripcion: string,
    estado: string
}
import { FindOptions, Iprenda, IprendaDocument } from "@Interfaces/prenda.intrfaces";
import Prenda from "@Models/Prenda";
import { PaginateOptions, PaginateResult } from "mongoose";

class PrendaDAO{

    async getAll(){
        return new Promise( ( resolve, reject ) => Prenda
            .find()
            .populate({ path: "categoria", select: "nombre" })
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            } )
        )
    }

    async getAllPaginate( page: number, limit: number, sort: string, find?: FindOptions ): Promise<PaginateResult<IprendaDocument>>{
        let options: PaginateOptions = {
            populate: { path: "categoria", select: "nombre" },
            limit,
            page,
            sort
        };

        if( find?.categoria === "" ) delete find.categoria;

        return new Promise( (resolve, reject) => Prenda
            .paginate( find, options, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            })
        )
    }

    async getOneById( id: string ): Promise<IprendaDocument>{
        return new Promise( (resolve, reject) => Prenda
            .findOne( { _id: id } ).exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async getOneBy( field: "slug" | "ref", value: string | number | boolean ): Promise<IprendaDocument | undefined>{
        if( field == "slug" ){
            return new Promise( (resolve, reject) => Prenda
                .findOne( { slug: value } )
                .populate({ path: "categoria", select: "nombre" })
                .exec( (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs!);
                } )
            )
        }

        if( field == "ref" ){
            return new Promise( (resolve, reject) => Prenda
                .findOne( { referencia: value } )
                .populate({ path: "categoria", select: "nombre" })
                .populate( { path: "tallasCantidadPrecio.colores.idColor", model: "Color", select: "nombre hex" } )
                .exec( (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs!);
                } )
            )
        }
    }

    async create( prenda: Object ){
        return new Promise( (resolve, reject) => Prenda
            .insertMany( prenda, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            } )
        )
    }

    async updateById( id: string, prenda: Object ): Promise<Iprenda>{
        return new Promise( (resolve, reject) => Prenda
            .findByIdAndUpdate( 
                id, prenda,
                {
                    new: true
                },
                (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs!);
                }
            )
        )
    }

    async deleteById( id: string ){
        return new Promise( (resolve, reject) => Prenda
            .findByIdAndDelete(id)
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            } )
        )
    }
}

export const prendaDAO = new PrendaDAO();
import { ICategoria, ICategoriaDocument } from "@Interfaces/categoria.interfaces";
import Categoria from "@Models/Categoria";

class CategoriaDAO {

    async getCategorias(){
        return new Promise( (resolve, reject) => Categoria
            .find().exec( (err, docs) => {
                if( err ) return reject(err);
                return resolve(docs)
            } )
        )
    }

    async getCategoriasPaginate( page: number, limit: number ){
       const options = {
        limit,
        page
       };
       return await Categoria.paginate({}, options)
    }

    async getCategoriaByName( name: string ){
        return new Promise( (resolve, reject) => Categoria
            .findOne( { nombre: name } ).exec( ( err, docs ) => {
                if( err ) return reject(err);
                return resolve(docs);
            } )
        )
    }

    async getFind( categorias: [string] ): Promise<ICategoriaDocument[]>{
        return new Promise( (resolve, reject) => Categoria
            .find( { nombre: {$in: categorias} } )
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs!);
            } )
        )
    }

    async createCategoria( categoria: ICategoria ){
        return new Promise( (resolve, reject) => Categoria.insertMany( categoria, (err, docs) => {
            if( err ) return reject(err);
            return resolve(docs);
        } )
        )
    }

    async updateCategoriaById( id: string, categoria: ICategoria ): Promise<ICategoria>{
        return new Promise( (resolve, reject) => Categoria.findByIdAndUpdate(
            id, categoria,
            {
                new: true
            },
            ( err, docs ) => {
                if(err) return reject(err);
                return resolve(docs!);
            }
        )
        )
    }

    async deleteCategoriaById( id: string ){
        return new Promise( (resolve, reject) => Categoria.findByIdAndDelete( id, {},
                (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs);
                }
            )
        )
    }

}

export const categoriaDAO = new CategoriaDAO();
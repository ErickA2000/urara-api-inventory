import Color from "@Models/Color";
import { IcolorDocument, Icolor } from "@Interfaces/color.interfaces";

class ColorDAO {

    async getAllColors(): Promise<IcolorDocument[]>{
        return new Promise( (resolve, reject) => Color
            .find()
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            } )     
        )
    }

    async getColorPaginate( page: number, limit: number ){
        const options = {
            limit,
            page
        };
        return new Promise( (resolve, reject) => Color
            .paginate({}, options, (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            })
        )
    }

    async getOneById( id: string ): Promise<IcolorDocument | null>{
        return new Promise( ( resolve, reject ) => Color
            .findById( id )
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            })
        )
    }

    async getOneByName( nameColor: string ): Promise<IcolorDocument | null>{
        return new Promise( (resolve, reject) => Color
            .findOne( { nombre: nameColor } )
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs)
            } )
        )
    }

    async addColor( color: Icolor ): Promise<IcolorDocument>{
        return new Promise( async (resolve, reject) => {
            const newColor = new Color(color);
            await newColor.save({}, (err, docs) => {
                if( err ) return reject(err);
                return resolve(docs);
            }) 
        })
    }

    async updateById( colorId: string, data: Object ): Promise<IcolorDocument | null>{
        return new Promise( (resolve, reject) => Color
            .findByIdAndUpdate(
                colorId, data,
                {
                    new: true
                },
                (err, docs) => {
                    if(err) return reject(err);
                    return resolve(docs);
                }
            )
        )
    }

    async deleteById( id: string ){
        return new Promise( (resolve, reject) => Color
            .findByIdAndDelete( id, {},
                (err, docs) => {
                    if( err ) return reject(err);
                    return resolve(docs);
                } 
            )
        )
    }

}

export const colorDAO = new ColorDAO();
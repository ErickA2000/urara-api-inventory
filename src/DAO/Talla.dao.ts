import Talla, { ITalla } from '@Models/Talla';

class TallaDAO {

    async getTallas(){
        return new Promise( ( resolve, reject ) => Talla
            .find().exec( (err, docs) => {
                if( err ) return reject(err);
                return resolve(docs);
            } )
        );
    }

    async getTallasPaginate( page: number, limit: number ){
        const options = {
            limit,
            page
        };
        return await Talla.paginate({}, options)
    }

    async getTallaByNumber( number: string ): Promise<ITalla | null>{
        return new Promise( ( resolve, reject ) => Talla
            .findOne( { numero: number } ).exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs);
            } )
        )
    }

    async getFind( talla: string ): Promise<ITalla[]>{
        return new Promise( (resolve, reject) => Talla
            .find({ numero: {$in: talla} })
            .exec( (err, docs) => {
                if(err) return reject(err);
                return resolve(docs)
            })
        )
    }

    async createTalla( data: Object ){
        return new Promise( ( resolve, reject ) => Talla.insertMany(data, (err, docs) => {
            if( err ) return reject(err);
            return resolve(docs);
        })
        )
    }

    async updateTallaById( id: string, data: Object ){
        const update = { $set: data }

        return new Promise( (resolve, reject) => Talla.findByIdAndUpdate(
                id, update,
                {
                    new: true
                },
                ( err, docs ) => {
                    if( err ) return reject(err);
                    return resolve(docs);
                }
            )
        )
    }

    async deleteTallaById( id: string ){
        return new Promise( (resolve, reject) => Talla.findByIdAndDelete(id, {},
                ( err, docs ) => {
                    if(err) return reject(err);
                    return resolve(docs);
                }
            )
        )
    }

}

export const tallaDAO = new TallaDAO();
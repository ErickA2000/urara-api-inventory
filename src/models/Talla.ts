import { Schema, model, Document, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2';

const tallaSchema = new Schema({
    numero: String
},{
    versionKey: false,
})

tallaSchema.plugin(paginate);

export default model<ITalla, PaginateModel<ITalla>>('Talla', tallaSchema)

export interface ITalla extends Document {
    numero: string
}
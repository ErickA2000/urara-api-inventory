import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2';
import { ICategoriaDocument } from '@Interfaces/categoria.interfaces';

const categoriaSchema = new Schema({
    nombre: String,
    descripcion: String,
    estado: String
},{
    timestamps: true,
    versionKey: false
});

categoriaSchema.plugin(paginate);

export default model<ICategoriaDocument, mongoose.PaginateModel<ICategoriaDocument>>('Categorias', categoriaSchema)
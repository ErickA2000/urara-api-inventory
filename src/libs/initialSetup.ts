import Talla from '@Models/Talla'
import Categoria from '@Models/Categoria';
import Color from '@Models/Color';

export const createTallas = async () => {
    try {
        const count = await Talla.estimatedDocumentCount();

        if ( count > 0 ) return;

        const values = await Promise.all([
            new Talla({numero: '2'}).save(),
            new Talla({numero: '4'}).save(),
            new Talla({numero: '6'}).save(),
            new Talla({numero: '8'}).save(),
            new Talla({numero: '10'}).save(),
            new Talla({numero: '12'}).save(),
            new Talla({numero: '14'}).save(),
            new Talla({numero: '16'}).save(),
        ]);

    } catch (error) {
        console.error(error)
    }
}

export const createCategorias = async () => {
    try {
        const count = await Categoria.estimatedDocumentCount();

        if( count > 0 ) return;

        const values = await Promise.all([
            new Categoria({
                nombre: 'niña',
                descripcion: 'Ropa para niña',
                estado: 'activa'
            }).save(),
            new Categoria({
                nombre: 'niño',
                descripcion: 'Ropa para niño',
                estado: 'activa'
            }).save(),
            new Categoria({
                nombre: 'dama',
                descripcion: 'Ropa para dama',
                estado: 'activa'
            }).save(),
            new Categoria({
                nombre: 'caballero',
                descripcion: 'Ropa para caballero',
                estado: 'activa'
            }).save(),
            new Categoria({
                nombre: 'indefinida',
                descripcion: 'Categoria no definida',
                estado: 'activa'
            }).save()
        ]);

    } catch (error) {
        console.error(error)
    }
}

export const createColors = async () => {
    try {
        const count = await Color.estimatedDocumentCount();

        if( count > 0 ) return;

        await Promise.all([
            new Color({ nombre: "blanco", hex: "#ffffff" }).save(),
            new Color({ nombre: "negro", hex: "#000000" }).save()
        ]);

    } catch (error) {
        console.log(error)
    }
}
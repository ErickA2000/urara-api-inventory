import { Request, Response, NextFunction } from 'express'
import { listParams } from '@Constants/global';
import { prendaDAO } from '@DAO/Prenda.dao';
import { categoriaDAO } from '@DAO/Categoria.dao';
import { tallaDAO } from '@DAO/Talla.dao';
import { CODES_HTTP } from '@Constants/global';
import { colorDAO } from '@DAO/Color.dao';


export const verificarDatosObligatoriosPrenda = ( req: Request, res: Response, next: NextFunction ) => {
    const { nombre, referencia, tallasCantidadPrecio, categoria } = req.body;

    if( !nombre || !referencia || tallasCantidadPrecio === undefined || categoria === undefined ||
        tallasCantidadPrecio.length == 0 || categoria.length == 0 ){
        return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Faltan llenar campos obligatorios"
        })
    }

    next();
}

export const verificarExisteReferencia = async ( req: Request, res: Response, next: NextFunction ) => {
    
    try {
        
        const foundReferencia = await prendaDAO.getOneBy( "ref", req.body.referencia );
        
        if( req.params.prendaId && req.method.includes("PUT") ){
            
            if( foundReferencia?._id != req.params.prendaId ) return res.status(CODES_HTTP.CONFLICT).json({ 
                success: false,
                message: "Ya existe la referencia" 
            });
        }else if( foundReferencia ) return res.status(CODES_HTTP.CONFLICT).json({ 
            success: false,
            message: "Ya existe la referencia" 
        });
    
    
        next();
    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Algo va mal: " + error
        });
    }
}

export const verificarExisteCategoria = async ( req: Request, res: Response, next: NextFunction ) => {
    
    if( req.body.categoria === undefined || req.body.categoria.length === 0 ){
        return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "No se ingreso categoria"
        })             
    }
    
    if( req.body.categoria ){
        const foundCategoria = await categoriaDAO.getFind( req.body.categoria );
        const categoriaNombre = foundCategoria.map( (categoria) => categoria.nombre );
        
        for(let i = 0; i < req.body.categoria.length; i++){
            if( !categoriaNombre.includes(req.body.categoria[i]) ){
                return res.status(CODES_HTTP.BAD_REQUEST).json({
                    success: false,
                    message: `La categoria ${req.body.categoria[i]} no existe`
                })
            }
        }
    }

    next();
}

export const verificarCategoria = async ( req: Request, res: Response, next: NextFunction ) => {
    const { nombre } = req.body;

    try {
        const categoria = await categoriaDAO.getCategoriaByName( nombre );

        if( req.params.categoriaId && req.method.includes("PUT") ){
            if( categoria != null && categoria._id != req.params.categoriaId ) return res.status(CODES_HTTP.CONFLICT).json({
                success: false,
                message: "Ya existe la categoria"
            });

        }else if( categoria ) return res.status(CODES_HTTP.CONFLICT).json({
            success: false,
            message: `La categoria ${nombre} ya se encuentra registrada`
        });
        
        
        next();
        
    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Algo va mal: " + error
        });
    }

}

export const verificarTallaCantidad = async ( req: Request, res: Response, next: NextFunction ) => {
    const {tallasCantidadPrecio} = req.body;

    if( tallasCantidadPrecio ){
        for( let i = 0; i < tallasCantidadPrecio.length; i++){
            const foundTalla = await tallaDAO.getFind( tallasCantidadPrecio[i].talla );
            if( foundTalla.length == 0 ){
                return res.status(CODES_HTTP.BAD_REQUEST).json({ 
                    success: false,
                    message:
                    `La talla ${tallasCantidadPrecio[i].talla} no se encuentra registrada`})
            }
        }

        for( let i = 0; i < tallasCantidadPrecio.length; i++ ){
            const cantidad = tallasCantidadPrecio[i].cantidad

            if( cantidad <= 0 ){
                return res.status(CODES_HTTP.BAD_REQUEST).json({
                    success: false,
                    message: `La cantidad ${tallasCantidadPrecio[i].cantidad} no es valida`
                })
            }
        }
        
    }  
    next();
}

export const vefificarExisteTalla = async ( req: Request, res: Response, next: NextFunction ) => {
    const { numero } = req.body;
    
    try {
        
        const foundTalla = await tallaDAO.getTallaByNumber( numero );

        if( req.params.tallaId && req.method.includes("PUT") ){

            if( foundTalla != null && foundTalla._id != req.params.tallaId ) return res.status(CODES_HTTP.CONFLICT).json({
                success: false,
                message: "La talla ya existe"
            });

        }else if( foundTalla ) return res.status(CODES_HTTP.CONFLICT).json({ 
            success: false,
            message: "La talla ya existe" 
        })
    
        next();
    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Algo va mal: " + error
        });
    }
}

export const verificarLongitud_id = ( req: Request, res: Response, next: NextFunction ) => {
    const _id = req.params;
    const message = "ID incorrecto";
    const keys = Object.keys(_id);

    for( let key of keys ){
        for( let param of listParams ){
            
            if( key == param ){
                
                if(_id[key].length < 24 || _id[key].length > 24) return res.status(CODES_HTTP.BAD_REQUEST).json({
                    success: false,
                    message
                })
            }
    
        }

    }
    
    next();
}

export const verificarExisteColor = async ( req: Request, res: Response, next: NextFunction ) => {
    const { nombre } = req.body;

    try {
        const foundColor = await colorDAO.getOneByName( nombre );

        if( req.params.IDcolor && req.method.includes("PUT") ){
            if( foundColor != null && foundColor._id != req.params.IDcolor ) return res.status(CODES_HTTP.CONFLICT).json({
                success: false,
                message: "El color ya existe"
            })
        }else if( foundColor ) return res.status(CODES_HTTP.CONFLICT).json({
            success: false,
            message: "El color ya existe"
        });

        next();

    } catch (error) {
        return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Algo va mal: " + error
        })
    }
}
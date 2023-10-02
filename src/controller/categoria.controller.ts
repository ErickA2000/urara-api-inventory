import { Request, Response } from "express";
import { categoriaDAO } from "@DAO/Categoria.dao";
import { CODES_HTTP } from "@Constants/global";

const showCateLog = require('../util/logger/logger.categoria')

class CategoriaController {

    public async getCategorias( req: Request, res: Response ){
        const categorias = await categoriaDAO.getCategorias();
        res.status(CODES_HTTP.OK).json({ 
            success: true,
            data: categorias
        })
    }

    public async getCategoriasPaginate( req: Request, res: Response ){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;
        const sort: string = req.query.sort as unknown as string || "";

        try {
            
            const categorias = await categoriaDAO.getCategoriasPaginate( page, limit, sort );
            
            res.status(CODES_HTTP.OK).json({ 
                success: true,
                data: categorias
            });
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Algo va mal: "+ error
            });
        }

    }

    public async getCategoriaByName( req: Request, res: Response ){
        const categoria = await categoriaDAO.getCategoriaByName( req.params.nombre );
        if( !categoria ){
            return res.status(CODES_HTTP.NO_FOUND).json({
                success: false,
                message: 'No se a encontrado la categoria'
            })
        }
        res.status(CODES_HTTP.OK).json({
            success: true,
            data: categoria
        })
    }

    public async createCategoria( req: Request, res: Response ){
        let { nombre, descripcion, estado } = req.body;

        if( nombre === undefined || !nombre ) return res.status(CODES_HTTP.BAD_REQUEST).json({ 
            success: false,
            message: "El nombre es obligatorio"
         });

        if( estado === undefined || !estado ){
            estado = "activa"
        }
        
        await categoriaDAO.createCategoria( { nombre, descripcion, estado } );
        
        showCateLog.info({ message: `Categoria '${nombre}' creada - user --> ${req.userId}` })
        res.status(CODES_HTTP.CREATED).json({
            success: true,
            message: "Creada categoria correctamente"
        })
    }

    public async updateCategoriaById( req: Request, res: Response ){
        const { nombre, descripcion } = req.body
        
        if( !nombre ) return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Se requiere el nombre"
        })        

        await categoriaDAO.updateCategoriaById( req.params.categoriaId, { nombre, descripcion } )

        showCateLog.info({ message: `Categoria '${nombre}' modificada - user --> ${req.userId}` })
        res.status(CODES_HTTP.OK).json({
            success: true,
            message: "Actualizada categoria correctamente"
        })
    }

    public async cambioEstadoTallaById( req: Request, res: Response ){
        const { estado } = req.body;
        let cambio = { estado: "" };

        if( estado == "activa" || estado == "inactiva" ){
            cambio.estado = estado;

            const categoriaCambioEstado = await categoriaDAO.updateCategoriaById( req.params.categoriaId, { estado })

            showCateLog.info({ message: `Se a cambiado el estado de la categoria ${categoriaCambioEstado!.nombre}
                - user -> ${ req.userId }` });
            res.status(CODES_HTTP.OK).json({
                success: true,
                message: 'Cambio de estado correctamente'
            }) 
        }else{
            return res.status(CODES_HTTP.BAD_REQUEST).json({
                success: false,
                message: "Estado recibido no valido"
            })
        }
    }

    public async deleteCategoriaById( req: Request, res: Response ){

        try {
            
            const categoriaDelete = await categoriaDAO.deleteCategoriaById( req.params.categoriaId );

            if( categoriaDelete === null ) throw Error("La categoria no existe");

            showCateLog.info({ message: `Categoria eliminada - user --> ${req.userId}` })
            res.status(CODES_HTTP.NO_CONTENT).json()
        } catch (error) {
            showCateLog.info({ message: `Error al eliminar categoria -Error ${error} - user --> ${req.userId}` });
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Algo va mal: " + error
            });
        }

    }
}

export const categoriaController = new CategoriaController();
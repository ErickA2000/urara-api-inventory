import { Request, Response } from "express";

import { prendaDAO } from "@DAO/Prenda.dao";
import { categoriaDAO } from "@DAO/Categoria.dao";
import { CODES_HTTP } from "@Constants/global";

const showPrendaLog = require('../util/logger/logger.prenda')

class PrendaController {

    public async getPrenda( req: Request, res: Response ){
        const prendas = await prendaDAO.getAll();
        
        res.status(CODES_HTTP.OK).json({
            success: true,
            data: prendas
        })
    }

    public async getPrendaPaginate( req: Request, res: Response ){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;
        const sort: string = req.query.sort as unknown as string || "";
        const categoria: string = req.query.categoria as unknown as string || "";
        const discount: boolean = req.query.discount as unknown as boolean || false;

        try {
            
            const prendas = await prendaDAO.getAllPaginate(page, limit, sort, { categoria, discount });

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: prendas
            });

        } catch (error) {
            return res.status( CODES_HTTP.INTERNAL_SERVER_ERROR ).json({
                success: false,
                message: "Algo va mal: " + error
            });
        }

    }

    public async getPrendaBySlug( req: Request, res: Response ){
        const prenda = await prendaDAO.getOneBy(  "slug", req.params.prendaSlug );
        if(!prenda){
            return res.status(CODES_HTTP.NO_FOUND).json({
                success: false,
                message: "No se a encontrado la prenda"
            })
        }
        res.status(CODES_HTTP.OK).json({
            success: true,
            data: prenda
        })
    }

    public async getPrendaByReferencia( req: Request, res: Response ){
        const prenda = await prendaDAO.getOneBy( "ref", req.params.referencia );
        if(!prenda){
            return res.status(CODES_HTTP.NO_FOUND).json({
                success: false,
                message: "No se a encontrado la referencia"
            })
        }
        res.status(CODES_HTTP.OK).json({
            success: true,
            data: prenda
        })
    }

    public async createPrenda( req: Request, res: Response ){

        const {nombre, descuento, estado, categoria } = req.body;
        const newPrenda = req.body;

        //Asignar estado por defecto
        if( !estado || estado === undefined ){
            newPrenda.estado = "disponible";
        }else{
            newPrenda.estado = estado;
        }

        //Asignar decuento por defecto en 0
        if( !descuento || descuento === undefined ){
            newPrenda.descuento = 0;
            newPrenda.discount = false;
        }else{
            newPrenda.descuento = descuento;

            if( descuento != 0 ) newPrenda.discount = true;
            if( descuento === 0 ) newPrenda.discount = false;

        }
        
        //Asignar categoria
        if( categoria ){
            const foundCategoria = await categoriaDAO.getFind( categoria );
            newPrenda.categoria = foundCategoria.map( (categoria) => categoria._id )
        }

        //Asignar slug por el nombre
        let regExp = new RegExp(' ', 'g');
        const slug = nombre.replace(regExp, '-')
        
        newPrenda.slug = slug;
       
        //Guardar prenda
        await prendaDAO.create( newPrenda );

        showPrendaLog.info({ message: `La prenda ${nombre} fue creada - user ${req.userId}` });
        res.status(CODES_HTTP.CREATED).json({
            success: true,
            message: 'Nueva prenda agregada'
        })
    }

    public async updatePrendaById( req: Request, res: Response ){
        const { categoria, descuento } = req.body;

        //Asignar categoria
        if( categoria ){
            const foundCategoria = await categoriaDAO.getFind( categoria );
            req.body.categoria = foundCategoria.map( (categoria) => categoria._id )
        }

        //Asignar slug por el nombre
        let regExp = new RegExp(' ', 'g');
        const slug = req.body.nombre.replace(regExp, '-')
        
        req.body.slug = slug;

        //Cambiar estado de discount segun el porcentaje de descuento
        if( descuento === 0 ) req.body.discount = false;
        if( descuento != 0 ) req.body.discount = true;
        
        const updatedPrenda = await prendaDAO.updateById( req.params.prendaId, req.body );
    
        showPrendaLog.info({ message: `La prenda ${updatedPrenda!.nombre} fue modificada - user -> ${req.userId}` });
        res.status(CODES_HTTP.OK).json({
            success: true,
            message: 'Prenda actualizada correctamente',
            data: updatedPrenda
        })
    }   

    public async cambioEstadoPrendaById( req: Request, res: Response ){
        const {estado} = req.body
        let cambio = { estado: "" }

        try {
            
            if( estado == "inactivo" || estado == "disponible" || estado == "agotado"){
                cambio.estado = estado;
    
                const prendaDesactivada = await prendaDAO.updateById( req.params.prendaId, cambio );

                if( prendaDesactivada === null ) throw Error("Prenda no encontrada");

                showPrendaLog.info({ message: `Se cambio el estado de la prenda 
                    ${prendaDesactivada!.nombre} - user -> ${req.userId}` })
                res.status(CODES_HTTP.OK).json({
                    success: true,
                    message: 'Cambio de estado correctamente'
                });
            }else {
                return res.status(CODES_HTTP.BAD_REQUEST).json({
                    success: false,
                    message: "Estado invalido"
                })
            }
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Algo va mal: " + error
            })
        }
        
    }

    public async deletePrendaById( req: Request, res: Response ){
        try {
            const prendaDetele = await prendaDAO.deleteById( req.params.prendaId );
            
            if( prendaDetele === null ) throw Error("La prenda no existe");
 
            showPrendaLog.info({ message: `Se elimino una prenda - user -> ${req.userId}` })
            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Eliminado correctamente"
            });
            
        } catch (error) {
            showPrendaLog.info({ message: `Error al eliminar una prenda - user -> ${req.userId}` })
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error al eliminar -> " + error
            })
        }
    }
}

export const prendaController = new PrendaController();
import { Request, Response } from "express";
import { tallaDAO } from "@DAO/Talla.dao";
import { CODES_HTTP } from "@Constants/global";

const showTallaLog = require('../util/logger/logger.rolTalla')

class TallaController {

    public async getTallas( req: Request, res: Response ){
        const tallas = await tallaDAO.getTallas();
        res.status(CODES_HTTP.OK).json({ 
            success: true,
            data: tallas
        })
    }

    public async getTallasPaginate( req: Request, res: Response ){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;

        const tallas = await tallaDAO.getTallasPaginate(page, limit);
        res.status(CODES_HTTP.OK).json({ 
            success: true,
            data: tallas
        })
    }

    public async getTallaByNumber( req: Request, res: Response ){
        const talla = await tallaDAO.getTallaByNumber(req.params.numero);
        
        if( !talla ) return res.status(CODES_HTTP.NO_FOUND).json({
            success: false,
            message: "NO se a encontrado la talla"
        })

        res.status(CODES_HTTP.OK).json({
            success: true,
            data: talla
        })
    }

    public async createTalla( req: Request, res: Response ){
        const { numero } = req.body;

        if( numero === undefined || !numero ) return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Numero requerido"
        })

        await tallaDAO.createTalla({numero});
        showTallaLog.info({ message: `Se creo la talla ${numero} - user -> ${req.userId}` })
        res.status(CODES_HTTP.OK).json({
            success: true,
            message: "Creada talla correctamente"
        })

    }

    public async updateTallaById( req: Request, res: Response ){
        const { numero } = req.body

        if( numero === undefined || !numero ) return res.status(CODES_HTTP.BAD_REQUEST).json({
            success: false,
            message: "Se requiere el numero"
        })

        await tallaDAO.updateTallaById( req.params.tallaId, {numero} );

        showTallaLog.info({ message: `Se modifico la talla ${numero} - user -> ${req.userId}` })
        res.status(CODES_HTTP.OK).json({
            success: true,
            message: "Actualizada talla correctamente"
        })
    }

    public async deleteTallaById( req: Request, res: Response ){
        
        await tallaDAO.deleteTallaById( req.params.tallaId );
        showTallaLog.info({ message: `Se elimino una talla - user -> ${req.userId}` })
        res.status(CODES_HTTP.OK).json({
            success: true
        })
    }

}

export const tallaController = new TallaController();
import { CODES_HTTP } from "@Constants/global";
import { colorDAO } from "@DAO/Color.dao";
import { Request, Response } from "express";

class ColorController {

    public async getAll( req: Request, res: Response ){
        try {
            const colores = await colorDAO.getAllColors();
            res.status(CODES_HTTP.OK).json({
                success: true,
                data: colores
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }

    public async getColorPaginate( req: Request, res: Response ){
        const limit: number = req.query.limit as unknown as number || 5;
        const page: number = req.query.page as unknown as number || 1;

        try {
            const colores = await colorDAO.getColorPaginate( page, limit );
            res.status(CODES_HTTP.OK).json({
                success: true,
                data: colores
            });
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            });
        }
    }

    public async getColorById( req: Request, res: Response ){
        try {
            if( !req.params.IDcolor ) throw "Falta el id del color";
            const color = await colorDAO.getOneById( req.params.IDcolor );

            if( !color ) throw "No se encontro el color";

            res.status(CODES_HTTP.OK).json({
                success: true,
                data: color
            })

        } catch (error) {
            return res.status(CODES_HTTP.NO_FOUND).json({
                success: false,
                messaje: error
            })
        }
    }

    public async addColor( req: Request, res: Response ){
        const { nombre, hex } = req.body;

        try {
            await colorDAO.addColor( { nombre, hex } );

            res.status(CODES_HTTP.CREATED).json({
                success: true,
                message: "Nuevo color agregado"
            })
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            });
        }
    }

    public async updateColor( req: Request, res: Response ){
        const color = req.body;

        try {

            if( !req.params.IDcolor ) throw "Falta id de color";

            await colorDAO.updateById( req.params.IDcolor, color );

            res.status(CODES_HTTP.OK).json({
                success: true,
                message: "Color actualizado"
            });
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            });
        }
    }

    public async deleteColor( req: Request, res: Response ){
        try {
            if( !req.params.IDcolor ) throw "Falta el id del color";
            const color = await colorDAO.deleteById( req.params.IDcolor );

            if( !color ) throw Error("El color no existe");

            res.sendStatus(CODES_HTTP.NO_CONTENT);
        } catch (error) {
            return res.status(CODES_HTTP.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Algo va mal: " + error
            });
        }
    }

}

export const colorController = new ColorController();
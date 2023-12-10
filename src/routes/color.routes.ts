import { Router } from "express";
import { colorController } from "@Controllers/color.controller";
import { autenticacion, cleanRequest, readRequest, validacion } from "@Middlewares/index";

class ColorRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', colorController.getAll);
        this.router.get('/p', colorController.getColorPaginate);
        this.router.get('/:IDcolor', [ validacion.verificarLongitud_id ], colorController.getColorById);

        this.router.post('/add', [ autenticacion.TokenValidation, autenticacion.isModerador, readRequest.decryptRequest,validacion.verificarExisteColor, 
            cleanRequest.cleanColores ], colorController.addColor)

        this.router.put('/update/:IDcolor', [ autenticacion.TokenValidation, autenticacion.isAdminOrModerador, validacion.verificarLongitud_id, 
            readRequest.decryptRequest, cleanRequest.cleanColores, validacion.verificarExisteColor ], colorController.updateColor);

        this.router.delete('/delete/:IDcolor', [ autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id ], 
        colorController.deleteColor);
    }
}

const colorRoutes = new ColorRoutes();
export default colorRoutes.router;
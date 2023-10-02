import { Router } from "express";
import { autenticacion, readRequest, validacion } from "@Middlewares/index";
import { tallaController } from "@Controllers/talla.controller";

class TallaRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', tallaController.getTallas);
        this.router.get('/p', tallaController.getTallasPaginate);
        this.router.get('/:numero', tallaController.getTallaByNumber);
        
        this.router.post('/create', [ autenticacion.TokenValidation, autenticacion.isModerador, 
            validacion.vefificarExisteTalla ],
            tallaController.createTalla)
        
        this.router.put('/update/:tallaId', [ autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id, 
             validacion.vefificarExisteTalla ],
            tallaController.updateTallaById);

        this.router.delete('/delete/:tallaId', [ autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id ],
            tallaController.deleteTallaById)
    }
}

const tallaRoutes = new TallaRoutes();
export default tallaRoutes.router;
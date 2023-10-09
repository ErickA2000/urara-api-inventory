import { Router } from "express";
import { prendaController } from "@Controllers/prenda.controller";
import { autenticacion, validacion, readRequest, cleanRequest } from '@Middlewares/index'

class PrendaRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', prendaController.getPrenda)
       this.router.get('/p', prendaController.getPrendaPaginate)
       this.router.get('/:prendaSlug', prendaController.getPrendaBySlug)
       this.router.get('/ref/:referencia', prendaController.getPrendaByReferencia)
        
       this.router.post('/', [ autenticacion.TokenValidation, autenticacion.isModerador, readRequest.decryptRequest, cleanRequest.cleanPrenda,
        validacion.verificarDatosObligatoriosPrenda, validacion.verificarExisteReferencia, 
        validacion.verificarExisteCategoria, validacion.verificarTallaCantidad], 
        prendaController.createPrenda)

       this.router.put('/:prendaId', [autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id, 
        readRequest.decryptRequest, cleanRequest.cleanPrenda, validacion.verificarExisteReferencia,
        validacion.verificarDatosObligatoriosPrenda, validacion.verificarExisteCategoria,
        validacion.verificarTallaCantidad], 
        prendaController.updatePrendaById)

        this.router.put('/cambioEstado/:prendaId', [ autenticacion.TokenValidation, validacion.verificarLongitud_id, cleanRequest.cleanPrenda,
            autenticacion.isModerador ], prendaController.cambioEstadoPrendaById)

       this.router.delete('/:prendaId', [autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id], 
        prendaController.deletePrendaById)
    }
}

const prendaRoutes = new PrendaRoutes();
export default prendaRoutes.router;
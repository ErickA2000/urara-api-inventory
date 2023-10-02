import { Router } from "express"
import { autenticacion, validacion, readRequest, cleanRequest } from "@Middlewares/index";
import { categoriaController } from "@Controllers/categoria.controller";

class CategoriaRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get( '/', categoriaController.getCategorias )
        this.router.get('/p', categoriaController.getCategoriasPaginate);
        this.router.get('/:nombre', categoriaController.getCategoriaByName );
        
        this.router.post( '/create', [ autenticacion.TokenValidation, autenticacion.isModerador,
            readRequest.decryptRequest, cleanRequest.cleanCategoria, validacion.verificarCategoria ], 
            categoriaController.createCategoria )
        
        this.router.put('/update/:categoriaId', [ autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id,
            readRequest.decryptRequest, cleanRequest.cleanCategoria ],       //validacion.verificarCategoria
            categoriaController.updateCategoriaById)
        
        this.router.put( '/cambioestado/:categoriaId', [ autenticacion.TokenValidation, autenticacion.isModerador, validacion.verificarLongitud_id,
            readRequest.decryptRequest, cleanRequest.cleanCategoria ], categoriaController.cambioEstadoTallaById)

        this.router.delete('/delete/:categoriaId', [ autenticacion.TokenValidation, autenticacion.isAdmin, validacion.verificarLongitud_id ], 
            categoriaController.deleteCategoriaById )
    }

}

const categoriaRoutes = new CategoriaRoutes();
export default categoriaRoutes.router;
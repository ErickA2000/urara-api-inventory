import { Router } from "express";
import prendaRoutes from "./prenda.routes";
import categoriaRoutes from "./categoria.routes";
import colorRoutes from "./color.routes";
import tallaRoutes from "./talla.routes";


class Routes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.use( '/categorias', categoriaRoutes );
        this.router.use( '/color', colorRoutes );
        this.router.use( '/prendas', prendaRoutes );
        this.router.use( '/tallas', tallaRoutes );
    }
}

const routes = new Routes();
export default routes.router;
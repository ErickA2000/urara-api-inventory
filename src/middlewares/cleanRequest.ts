import { Request, Response, NextFunction } from 'express';

function clean( typeData: string[], req: Request ){
    const keys = Object.keys(req.body);
    const clean: any = {};
    
    for( let key of keys ){
        for( let nameProperti of typeData ){
            if( key === nameProperti ){
                clean[key] = req.body[key];
            }
        }
    }

    return clean;
}

export const cleanPrenda = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataPrenda = ["nombre", "referencia", "slug", "imagenUrl", "descripcion", "tallasCantidadPrecio", "descuento", "estado", "categoria"];
   
    const cleanPrenda = clean(typeDataPrenda, req);

    req.body = cleanPrenda;
    
    next();
}

export const cleanCompra = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataCompra = ["cliente",  "telefono",   "vendedor",   "productos",   "direccionFacturacion",   "subtotal",   "descuento",   "iva",   
        "iva_moneda",   "domicilio",   "total",   "formaPago",   "observaciones",   "estado",   "isCambioEstado", "servicioPago"];
    
    const cleanCompra = clean(typeDataCompra, req);

    req.body = cleanCompra;
    
    next();
}

export const cleanPayment = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataPayment = ["cliente",   "vendedor",   "productos",  "products", "direccionFacturacion",   "subtotal",   "descuento",   "iva",   
        "iva_moneda", "total", "payservice"];
    
    const cleanPayment = clean(typeDataPayment, req);

    req.body = cleanPayment;
    
    next();
}

export const cleanAuthAndUser = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataAuth = [ "nombre", "telefono", "email", "username", "clave", "roles", "verify2fa", "direcciones" ];

    const cleanAuth = clean( typeDataAuth, req );

    req.body = cleanAuth;
    
    next();
}

export const cleanCategoria = (req: Request, res: Response, next: NextFunction) => {
    
    const typeDataCategoria = [ "nombre", "descripcion", "estado" ];

    const cleanCategoria = clean(typeDataCategoria, req);

    req.body = cleanCategoria;

    next();
}

export const cleanDevice = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataDevice = [ "idUsuario", "token", "estado", "activa", "dispositivo", "navegador", 
        "ipv4", "ubicacion", "plataform" ];

    const cleanDevice = clean(typeDataDevice, req);

    req.body = cleanDevice;

    next();
}

export const cleanColores = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataColor = [ "nombre", "hex"];

    const cleanColor = clean(typeDataColor, req);

    req.body = cleanColor;

    next();
}

export const cleanCarrito = ( req: Request, res: Response, next: NextFunction ) => {
    
    const typeDataCarrito = [ "cliente", "productos"];

    const cleanCarrito = clean(typeDataCarrito, req);

    req.body = cleanCarrito;

    next();
}
//tipo de dato que devuelve el endpoint GET /api/estado de nodejs
export interface IEstado {
    ok: boolean;
    mongo: string;
    mensaje: string;
}

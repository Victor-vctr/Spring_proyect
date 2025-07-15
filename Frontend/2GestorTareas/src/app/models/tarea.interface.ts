export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Estado;
  prioridad: Prioridad;
  fechaCreacion: string;
  fechaLimite: string;
}

export interface CrearTareaDTO {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  fechaLimite: string;
}

export interface ActualizarTareaDTO {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  fechaLimite: string;
  estado: Estado;
}

export interface RespuestaDTO {
  mensaje: string;
  exito: boolean;
}

export type Prioridad = 'baja' | 'media' | 'alta';
export type Estado = 'pendiente' | 'en_progreso' | 'completada';

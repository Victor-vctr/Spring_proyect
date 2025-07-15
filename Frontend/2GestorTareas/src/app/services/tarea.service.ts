import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, finalize } from 'rxjs';
import { Tarea, CrearTareaDTO, ActualizarTareaDTO, RespuestaDTO, Estado } from '../models/tarea.interface';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private readonly API_URL = 'http://localhost:8080/api/tareas';

  private tareasSignal = signal<Tarea[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  public readonly tareas = this.tareasSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  public readonly tareasPendientes = computed(() =>
    this.tareasSignal().filter(tarea => tarea.estado === 'pendiente')
  );

  public readonly tareasEnProgreso = computed(() =>
    this.tareasSignal().filter(tarea => tarea.estado === 'en_progreso')
  );

  public readonly tareasCompletadas = computed(() =>
    this.tareasSignal().filter(tarea => tarea.estado === 'completada')
  );

  public readonly tareasVencidas = computed(() =>
    this.tareasSignal().filter(tarea => {
      const fechaLimite = new Date(tarea.fechaLimite);
      const ahora = new Date();
      return fechaLimite < ahora && tarea.estado !== 'completada';
    })
  );

  constructor(private http: HttpClient) {}

  cargarTareas(): Observable<Tarea[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Tarea[]>(this.API_URL).pipe(
      tap(tareas => {
        this.tareasSignal.set(tareas);
      }),
      catchError(this.manejarError.bind(this)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  obtenerTarea(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.API_URL}/${id}`).pipe(
      catchError(this.manejarError.bind(this))
    );
  }

  crearTarea(tarea: CrearTareaDTO): Observable<RespuestaDTO> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<RespuestaDTO>(this.API_URL, tarea).pipe(
      tap(() => {
        this.cargarTareas().subscribe();
      }),
      catchError(this.manejarError.bind(this)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  actualizarTarea(id: number, tarea: ActualizarTareaDTO): Observable<RespuestaDTO> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<RespuestaDTO>(`${this.API_URL}/${id}`, tarea).pipe(
      tap(() => {
        this.cargarTareas().subscribe();
      }),
      catchError(this.manejarError.bind(this)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  eliminarTarea(id: number): Observable<RespuestaDTO> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.delete<RespuestaDTO>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.cargarTareas().subscribe();
      }),
      catchError(this.manejarError.bind(this)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  filtrarPorEstado(estado: Estado): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.API_URL}/estado/${estado}`).pipe(
      catchError(this.manejarError.bind(this))
    );
  }

  marcarComoCompletada(id: number): Observable<RespuestaDTO> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.put<RespuestaDTO>(`${this.API_URL}/${id}/completar`, {}).pipe(
      tap(() => {
        this.cargarTareas().subscribe();
      }),
      catchError(this.manejarError.bind(this)),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  obtenerTareasVencidas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.API_URL}/vencidas`).pipe(
      catchError(this.manejarError.bind(this))
    );
  }

  limpiarError(): void {
    this.errorSignal.set(null);
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
    } else {
      if (error.error?.mensaje) {
        mensajeError = error.error.mensaje;
      } else {
        mensajeError = `Error ${error.status}: ${error.message}`;
      }
    }

    this.errorSignal.set(mensajeError);
    return throwError(() => new Error(mensajeError));
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaService } from '../services/tarea.service';
import { Tarea, CrearTareaDTO, ActualizarTareaDTO, Prioridad, Estado } from '../models/tarea.interface';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      @if (tareaService.loading()) {
        <div class="loading">Cargando tareas...</div>
      }

      @if (tareaService.error()) {
        <div class="error">
          {{ tareaService.error() }}
          <button (click)="tareaService.limpiarError()">Cerrar</button>
        </div>
      }

      <div class="form-section">
        <h2>{{ editandoTarea ? 'Editar Tarea' : 'Crear Nueva Tarea' }}</h2>
        <form (ngSubmit)="guardarTarea()" #tareaForm="ngForm">
          <div class="form-group">
            <label for="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              [(ngModel)]="nuevaTarea.titulo"
              required
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              [(ngModel)]="nuevaTarea.descripcion"
              required
              class="form-control"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="prioridad">Prioridad:</label>
              <select
                id="prioridad"
                name="prioridad"
                [(ngModel)]="nuevaTarea.prioridad"
                required
                class="form-control"
              >
                <option value="">Seleccionar prioridad</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="fechaLimite">Fecha Límite:</label>
              <input
                type="datetime-local"
                id="fechaLimite"
                name="fechaLimite"
                [(ngModel)]="nuevaTarea.fechaLimite"
                required
                class="form-control"
              >
            </div>
          </div>

          @if (editandoTarea) {
            <div class="form-group">
              <label for="estado">Estado:</label>
              <select
                id="estado"
                name="estado"
                [(ngModel)]="nuevaTarea.estado"
                required
                class="form-control"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          }

          <div class="form-actions">
            <button type="submit" [disabled]="!tareaForm.valid" class="btn btn-primary">
              {{ editandoTarea ? 'Actualizar' : 'Crear' }}
            </button>
            @if (editandoTarea) {
              <button type="button" (click)="cancelarEdicion()" class="btn btn-secondary">
                Cancelar
              </button>
            }
          </div>
        </form>
      </div>

      <div class="filters-section">
        <h3>Filtros</h3>
        <div class="filter-buttons">
          <button
            (click)="cargarTareas()"
            [class.active]="filtroActual === 'todas'"
            class="btn btn-filter"
          >
            Todas ({{ totalTareas }})
          </button>
          <button
            (click)="filtrarPorEstado('pendiente')"
            [class.active]="filtroActual === 'pendiente'"
            class="btn btn-filter"
          >
            Pendientes ({{ pendientesCount }})
          </button>
          <button
            (click)="filtrarPorEstado('en_progreso')"
            [class.active]="filtroActual === 'en_progreso'"
            class="btn btn-filter"
          >
            En Progreso ({{ enProgresoCount }})
          </button>
          <button
            (click)="filtrarPorEstado('completada')"
            [class.active]="filtroActual === 'completada'"
            class="btn btn-filter"
          >
            Completadas ({{ completadasCount }})
          </button>
          <button
            (click)="cargarTareasVencidas()"
            [class.active]="filtroActual === 'vencidas'"
            class="btn btn-filter btn-warning"
          >
            Vencidas ({{ vencidasCount }})
          </button>
        </div>
      </div>

      <div class="tareas-section">
        <h3>Tareas {{ filtroActual !== 'todas' ? '(' + filtroActual + ')' : '' }}</h3>

        @if (tareasFiltradas.length === 0) {
          <div class="no-tareas">
            @if (filtroActual === 'vencidas') {
              <p>No hay tareas vencidas</p>
            } @else {
              <p>No hay tareas {{ filtroActual !== 'todas' ? filtroActual : '' }}</p>
            }
          </div>
        } @else {
          <div class="tareas-grid">
            @for (tarea of tareasFiltradas; track tarea.id) {
              <div class="tarea-card" [class.vencida]="esVencida(tarea)">
                <h4>{{ tarea.titulo }}</h4>
                <p>{{ tarea.descripcion }}</p>

                <div class="tarea-info">
                  <span class="estado" [class]="getEstadoClass(tarea.estado)">
                    {{ tarea.estado }}
                  </span>
                  <span class="prioridad" [class]="tarea.prioridad.toLowerCase()">
                    {{ tarea.prioridad }}
                  </span>
                </div>

                <div class="fechas">
                  <small>Creada: {{ formatearFecha(tarea.fechaCreacion) }}</small>
                  <small>Límite: {{ formatearFecha(tarea.fechaLimite) }}</small>
                </div>

                <div class="acciones">
                  @if (tarea.estado !== 'completada') {
                    <button (click)="marcarCompletada(tarea.id)" class="btn btn-success">
                      Completar
                    </button>
                  }
                  <button (click)="editarTarea(tarea)" class="btn btn-info">
                    Editar
                  </button>
                  <button (click)="eliminarTarea(tarea.id)" class="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalTareas }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ pendientesCount }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ enProgresoCount }}</span>
          <span class="stat-label">En Progreso</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ completadasCount }}</span>
          <span class="stat-label">Completadas</span>
        </div>
        <div class="stat-item warning">
          <span class="stat-number">{{ vencidasCount }}</span>
          <span class="stat-label">Vencidas</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading {
      text-align: center;
      padding: 20px;
      font-weight: bold;
      background: #e3f2fd;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .error {
      background: #ffebee;
      color: #c62828;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .form-section h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .filters-section {
      margin-bottom: 30px;
    }

    .filters-section h3 {
      margin-bottom: 15px;
      color: #333;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tareas-section {
      margin-bottom: 30px;
    }

    .tareas-section h3 {
      margin-bottom: 20px;
      color: #333;
    }

    .no-tareas {
      text-align: center;
      padding: 40px;
      background: #f5f5f5;
      border-radius: 8px;
      color: #666;
    }

    .tareas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .tarea-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
    }

    .tarea-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .tarea-card.vencida {
      border-color: #f44336;
      background: #ffebee;
    }

    .tarea-card h4 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    }

    .tarea-card p {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.4;
    }

    .tarea-info {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }

    .estado, .prioridad {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }

    .estado.pendiente { background: #fff3e0; color: #e65100; }
    .estado.en-progreso { background: #e3f2fd; color: #1565c0; }
    .estado.completada { background: #e8f5e8; color: #2e7d32; }

    .prioridad.alta { background: #ffebee; color: #c62828; }
    .prioridad.media { background: #fff3e0; color: #e65100; }
    .prioridad.baja { background: #e8f5e8; color: #2e7d32; }

    .fechas {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 15px;
    }

    .fechas small {
      color: #888;
      font-size: 12px;
    }

    .acciones {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary { background: #2196f3; color: white; }
    .btn-primary:hover:not(:disabled) { background: #1976d2; }

    .btn-secondary { background: #757575; color: white; }
    .btn-secondary:hover { background: #616161; }

    .btn-success { background: #4caf50; color: white; }
    .btn-success:hover { background: #388e3c; }

    .btn-info { background: #00bcd4; color: white; }
    .btn-info:hover { background: #0097a7; }

    .btn-danger { background: #f44336; color: white; }
    .btn-danger:hover { background: #d32f2f; }

    .btn-filter {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-filter:hover,
    .btn-filter.active {
      background: #2196f3;
      color: white;
      border-color: #2196f3;
    }

    .btn-warning {
      background: #ff9800;
      color: white;
    }

    .btn-warning:hover,
    .btn-warning.active {
      background: #f57c00;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 15px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-item.warning {
      background: #fff3e0;
      border: 1px solid #ff9800;
    }

    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .tareas-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .filter-buttons {
        flex-direction: column;
      }

      .acciones {
        flex-direction: column;
      }
    }
  `]
})
export class TareasComponent implements OnInit {
  tareaService = inject(TareaService);

  nuevaTarea: CrearTareaDTO & { estado?: Estado } = {
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    fechaLimite: '',
    estado: 'pendiente'
  };

  editandoTarea: Tarea | null = null;
  filtroActual: string = 'todas';
  tareasFiltradas: Tarea[] = [];
  totalTareas = 0;
  pendientesCount = 0;
  enProgresoCount = 0;
  completadasCount = 0;
  vencidasCount = 0;

  ngOnInit() {
    this.cargarTareas();
    this.contarVencidas();
  }

  cargarTareas() {
    this.filtroActual = 'todas';
    this.tareaService.cargarTareas().subscribe(tareas => {
      this.tareasFiltradas = tareas;
      this.totalTareas = tareas.length;
      this.contarEstados(tareas);
    });
  }

  filtrarPorEstado(estado: Estado) {
    this.filtroActual = estado;
    this.tareaService.filtrarPorEstado(estado).subscribe(tareas => {
      this.tareasFiltradas = tareas;
      this.contarEstados(tareas);
    });
  }

  cargarTareasVencidas() {
    this.filtroActual = 'vencidas';
    this.tareaService.obtenerTareasVencidas().subscribe(tareas => {
      this.tareasFiltradas = tareas;
      this.vencidasCount = tareas.length;
    });
  }

  contarEstados(tareas: Tarea[]) {
    this.pendientesCount = tareas.filter(t => t.estado === 'pendiente').length;
    this.enProgresoCount = tareas.filter(t => t.estado === 'en_progreso').length;
    this.completadasCount = tareas.filter(t => t.estado === 'completada').length;
  }

  contarVencidas() {
    this.tareaService.obtenerTareasVencidas().subscribe(tareas => {
      this.vencidasCount = tareas.length;
    });
  }

  guardarTarea() {
    if (this.editandoTarea) {
      const tareaActualizada: ActualizarTareaDTO = {
        titulo: this.nuevaTarea.titulo,
        descripcion: this.nuevaTarea.descripcion,
        prioridad: this.nuevaTarea.prioridad,
        fechaLimite: this.nuevaTarea.fechaLimite,
        estado: this.nuevaTarea.estado || 'pendiente'
      };

      this.tareaService.actualizarTarea(this.editandoTarea.id, tareaActualizada).subscribe(() => {
        this.limpiarFormulario();
        this.cargarTareas();
        this.contarVencidas();
      });
    } else {

      this.tareaService.crearTarea(this.nuevaTarea).subscribe(() => {
        this.limpiarFormulario();
        this.cargarTareas();
        this.contarVencidas();
      });
    }
  }

  editarTarea(tarea: Tarea) {
    this.editandoTarea = tarea;
    this.nuevaTarea = {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      fechaLimite: tarea.fechaLimite,
      estado: tarea.estado
    };

    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editandoTarea = null;
    this.nuevaTarea = {
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      fechaLimite: '',
      estado: 'pendiente'
    };
  }

  marcarCompletada(id: number) {
    this.tareaService.marcarComoCompletada(id).subscribe(() => {
      this.cargarTareas();
      this.contarVencidas();
    });
  }

  eliminarTarea(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.tareaService.eliminarTarea(id).subscribe(() => {
        this.cargarTareas();
        this.contarVencidas();
      });
    }
  }

  esVencida(tarea: Tarea): boolean {
    const fechaLimite = new Date(tarea.fechaLimite);
    const ahora = new Date();
    return fechaLimite < ahora && tarea.estado !== 'completada';
  }

  getEstadoClass(estado: string): string {
    return estado.toLowerCase().replace(' ', '-');
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

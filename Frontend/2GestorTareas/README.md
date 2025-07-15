# Gestor de Tareas — Frontend Angular

## Descripción General
Este proyecto es un frontend desarrollado en Angular 20 para gestionar tareas, conectado a una API RESTful. Permite crear, listar, actualizar, eliminar, filtrar por estado, marcar como completadas y ver tareas vencidas.

## Estructura de Carpetas

```
src/
  app/
    components/
      tareas.component.ts      # Componente principal de tareas
    models/
      tarea.interface.ts       # Interfaces y tipos de datos
    services/
      tarea.service.ts         # Servicio para consumir la API
    app.config.ts              # Configuración principal de Angular
    app.routes.ts              # Rutas de la aplicación
    app.ts                     # Componente raíz
  index.html
  main.ts
```

## Instalación y Ejecución

1. **Clona el repositorio y entra en la carpeta:**
   ```bash
   git clone <repo-url>
   cd <repo>
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm start
   ```
4. **Abre tu navegador en:**
   [http://localhost:4200](http://localhost:4200)

> **Nota:** Asegúrate de que la API backend esté corriendo en [http://localhost:8080/api/tareas](http://localhost:8080/api/tareas)

## Funcionalidades
- Listar todas las tareas
- Crear nueva tarea
- Editar tarea existente
- Eliminar tarea
- Filtrar por estado: pendiente, en progreso, completada
- Ver tareas vencidas
- Marcar tarea como completada
- Estadísticas en tiempo real
- Manejo de errores y estados de carga

## Endpoints Consumidos

- `GET /api/tareas` — Listar todas las tareas
- `GET /api/tareas/estado/{estado}` — Listar tareas por estado (`pendiente`, `en_progreso`, `completada`)
- `GET /api/tareas/vencidas` — Listar tareas vencidas
- `POST /api/tareas` — Crear nueva tarea
- `PUT /api/tareas/{id}` — Actualizar tarea
- `PUT /api/tareas/{id}/completar` — Marcar tarea como completada
- `DELETE /api/tareas/{id}` — Eliminar tarea

## Modelos de Datos

### Tarea
```ts
interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  prioridad: 'baja' | 'media' | 'alta';
  fechaCreacion: string;
  fechaLimite: string;
}
```

### CrearTareaDTO
```ts
interface CrearTareaDTO {
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  fechaLimite: string;
}
```

### ActualizarTareaDTO
```ts
interface ActualizarTareaDTO {
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  fechaLimite: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
}
```

## Notas de Desarrollo
- El frontend usa Angular 20 y Signals para reactividad.
- Los filtros de estado y vencidas consultan directamente la API.
- Los valores de estado y prioridad deben coincidir exactamente con los definidos en la base de datos y la API.
- El manejo de errores y loading es global y visible en la UI.
- El proyecto es fácilmente extensible para nuevas funcionalidades.

## Autores y Licencia
- Desarrollado por [Tu Nombre o Equipo]
- Licencia: MIT

# API de Gestión de Tareas

Esta API permite gestionar tareas (crear, listar, actualizar, eliminar, filtrar por estado, marcar como completadas y ver vencidas). Es ideal para ser consumida por aplicaciones frontend.

## Base URL

```
http://localhost:8080/api/tareas
```

## Endpoints

### 1. Listar todas las tareas
- **GET /**
- **Respuesta:** Array de objetos `Tarea`

### 2. Obtener tarea por ID
- **GET /{id}**
- **Respuesta:** Objeto `TareaDTO`

### 3. Crear una nueva tarea
- **POST /**
- **Body:** Objeto `CrearTareaDTO` (JSON)
- **Respuesta:** Objeto `RespuestaDTO`

#### Ejemplo de body:
```json
{
  "titulo": "Comprar víveres",
  "descripcion": "Leche, pan, huevos",
  "prioridad": "Alta",
  "fechaLimite": "2024-06-30T18:00:00"
}
```

### 4. Actualizar una tarea existente
- **PUT /{id}**
- **Body:** Objeto `ActualizarTareaDTO` (JSON)
- **Respuesta:** Objeto `RespuestaDTO`

#### Ejemplo de body:
```json
{
  "titulo": "Comprar víveres y frutas",
  "descripcion": "Leche, pan, huevos, manzanas",
  "prioridad": "Media",
  "fechaLimite": "2024-07-01T18:00:00",
  "estado": "En progreso"
}
```

### 5. Eliminar una tarea
- **DELETE /{id}**
- **Respuesta:** Objeto `RespuestaDTO`

### 6. Listar tareas por estado
- **GET /estado/{estado}**
- **Respuesta:** Array de objetos `Tarea`
- **Ejemplo:** `/estado/Completada`

### 7. Marcar tarea como completada
- **PUT /{id}/completar**
- **Respuesta:** Objeto `RespuestaDTO`

### 8. Listar tareas vencidas
- **GET /vencidas**
- **Respuesta:** Array de objetos `Tarea`

---

## Estructura de datos

### CrearTareaDTO
```json
{
  "titulo": "string",
  "descripcion": "string",
  "prioridad": "string",
  "fechaLimite": "yyyy-MM-dd'T'HH:mm:ss"
}
```

### ActualizarTareaDTO
```json
{
  "titulo": "string",
  "descripcion": "string",
  "prioridad": "string",
  "fechaLimite": "yyyy-MM-dd'T'HH:mm:ss",
  "estado": "string"
}
```

### TareaDTO / Tarea
```json
{
  "id": 1,
  "titulo": "string",
  "descripcion": "string",
  "estado": "string",
  "prioridad": "string",
  "fechaCreacion": "yyyy-MM-dd HH:mm:ss",
  "fechaLimite": "yyyy-MM-dd HH:mm:ss"
}
```

### RespuestaDTO
```json
{
  "mensaje": "string",
  "exito": true
}
```

---

## Ejemplos de uso

### Obtener todas las tareas (fetch JS)
```js
fetch('http://localhost:8080/api/tareas')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Crear tarea (fetch JS)
```js
fetch('http://localhost:8080/api/tareas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    titulo: 'Nueva tarea',
    descripcion: 'Descripción',
    prioridad: 'Alta',
    fechaLimite: '2024-07-01T18:00:00'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Eliminar tarea (curl)
```bash
curl -X DELETE http://localhost:8080/api/tareas/1
```

---

## Configuración CORS para Angular

La API está configurada para permitir peticiones desde aplicaciones Angular:

- **Orígenes permitidos:** `http://localhost:4200` (Angular por defecto)
- **Métodos HTTP:** GET, POST, PUT, DELETE, OPTIONS, HEAD, TRACE, CONNECT
- **Headers:** Todos (`*`)
- **Credentials:** Permitidos
- **Cache preflight:** 1 hora

### Configuración en Angular

En tu aplicación Angular, asegúrate de configurar el `HttpClient` correctamente:

```typescript
// En tu servicio Angular
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:8080/api/tareas';

  constructor(private http: HttpClient) { }

  getTareas() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearTarea(tarea: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.apiUrl, tarea, { headers });
  }
}
```

## Notas
- Los campos de fecha deben ir en formato ISO (`yyyy-MM-dd'T'HH:mm:ss`).
- No requiere autenticación por defecto.
- Respuestas de error devuelven un objeto `RespuestaDTO` con `exito: false` y un mensaje.

---

¡Listo para conectar tu frontend!
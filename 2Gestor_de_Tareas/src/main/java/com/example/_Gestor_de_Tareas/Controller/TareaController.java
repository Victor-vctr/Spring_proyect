package com.example._Gestor_de_Tareas.Controller;

import com.example._Gestor_de_Tareas.DTOs.*;
import com.example._Gestor_de_Tareas.Service.ITareaService;
import com.example._Gestor_de_Tareas.Models.Tareas;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    private final ITareaService tareaService;

    public TareaController(ITareaService tareaService) {
        this.tareaService = tareaService;
    }

    /**
     * Obtiene la lista de todas las tareas.
     * @return Lista de tareas.
     */
    @GetMapping
    public CompletableFuture<ResponseEntity<List<Tareas>>> listarTareas() {
        return tareaService.listarTareas().thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<TareaDTO>> obtenerTareaPorId(@PathVariable int id) {
        return tareaService.obtenerTareaPorId(id)
                .thenApply(ResponseEntity::ok);
    }

    /**
     * Crea una nueva tarea.
     * @param crearTareaDTO Datos para la creación de la tarea.
     * @return Mensaje de éxito o error.
     */
    @PostMapping
    public CompletableFuture<ResponseEntity<RespuestaDTO>> crearTarea(@RequestBody CrearTareaDTO crearTareaDTO) {
        return tareaService.crearTarea(crearTareaDTO)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.badRequest().body(respuesta));
    }

    /**
     * Actualiza una tarea existente.
     * @param id ID de la tarea a actualizar.
     * @param actualizarTareaDTO Datos a actualizar.
     * @return Mensaje de éxito o error.
     */
    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<RespuestaDTO>> actualizarTarea(@PathVariable int id, @RequestBody ActualizarTareaDTO actualizarTareaDTO) {
        return tareaService.actualizarTarea(id, actualizarTareaDTO)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.notFound().build());
    }

    /**
     * Elimina una tarea por su ID.
     * @param id ID de la tarea a eliminar.
     * @return Mensaje de éxito o error.
     */
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<RespuestaDTO>> eliminarTarea(@PathVariable int id) {
        return tareaService.eliminarTarea(id)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.notFound().build());
    }

    /**
     * Lista las tareas por estado.
     * @param estado Estado de las tareas a listar.
     * @return Lista de tareas con el estado especificado.
     */
    @GetMapping("/estado/{estado}")
    public CompletableFuture<ResponseEntity<List<Tareas>>> listarPorEstado(@PathVariable String estado) {
        return tareaService.listarPorEstado(estado).thenApply(ResponseEntity::ok);
    }

    /**
     * Marca una tarea como completada.
     * @param id ID de la tarea a completar.
     * @return Mensaje de éxito o error.
     */
    @PutMapping("/{id}/completar")
    public CompletableFuture<ResponseEntity<RespuestaDTO>> marcarComoCompletada(@PathVariable int id) {
        return tareaService.marcarComoCompletada(id)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.notFound().build());
    }

    /**
     * Lista las tareas vencidas (fecha límite pasada y no completadas).
     * @return Lista de tareas vencidas.
     */
    @GetMapping("/vencidas")
    public CompletableFuture<ResponseEntity<List<Tareas>>> listarTareasVencidas() {
        return tareaService.listarTareasVencidas().thenApply(ResponseEntity::ok);
    }
}

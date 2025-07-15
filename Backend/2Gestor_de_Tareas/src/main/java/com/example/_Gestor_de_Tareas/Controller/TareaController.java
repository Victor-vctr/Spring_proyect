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
public class TareaController {

    private final ITareaService tareaService;

    public TareaController(ITareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<Tareas>>> listarTareas() {
        return tareaService.listarTareas().thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<TareaDTO>> obtenerTareaPorId(@PathVariable int id) {
        return tareaService.obtenerTareaPorId(id)
                .thenApply(ResponseEntity::ok);
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<RespuestaDTO>> crearTarea(@RequestBody CrearTareaDTO crearTareaDTO) {
        return tareaService.crearTarea(crearTareaDTO)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.badRequest().body(respuesta));
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<RespuestaDTO>> actualizarTarea(@PathVariable int id, @RequestBody ActualizarTareaDTO actualizarTareaDTO) {
        return tareaService.actualizarTarea(id, actualizarTareaDTO)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<RespuestaDTO>> eliminarTarea(@PathVariable int id) {
        return tareaService.eliminarTarea(id)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    public CompletableFuture<ResponseEntity<List<Tareas>>> listarPorEstado(@PathVariable String estado) {
        return tareaService.listarPorEstado(estado).thenApply(ResponseEntity::ok);
    }

    @PutMapping("/{id}/completar")
    public CompletableFuture<ResponseEntity<RespuestaDTO>> marcarComoCompletada(@PathVariable int id) {
        return tareaService.marcarComoCompletada(id)
                .thenApply(respuesta -> respuesta.isExito() ? ResponseEntity.ok(respuesta) : ResponseEntity.notFound().build());
    }

    @GetMapping("/vencidas")
    public CompletableFuture<ResponseEntity<List<Tareas>>> listarTareasVencidas() {
        return tareaService.listarTareasVencidas().thenApply(ResponseEntity::ok);
    }
}

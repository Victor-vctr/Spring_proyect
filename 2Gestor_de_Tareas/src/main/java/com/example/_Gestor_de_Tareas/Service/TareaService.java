package com.example._Gestor_de_Tareas.Service;

import com.example._Gestor_de_Tareas.DTOs.*;
import com.example._Gestor_de_Tareas.Models.Tareas;
import com.example._Gestor_de_Tareas.Repository.ITareaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class TareaService implements ITareaService {
    private final ITareaRepository tareaRepository;

    public TareaService(ITareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    private TareaDTO toDTO(Tareas tarea) {
        TareaDTO dto = new TareaDTO();
        dto.setId(tarea.getId());
        dto.setTitulo(tarea.getTitulo());
        dto.setDescripcion(tarea.getDescripcion());
        dto.setEstado(tarea.getEstado());
        dto.setPrioridad(tarea.getPrioridad());
        dto.setFechaCreacion(tarea.getFechaCreacion());
        dto.setFechaLimite(tarea.getFechaLimite());
        return dto;
    }

    @Async
    @Override
    public CompletableFuture<List<Tareas>> listarTareas() {
        return CompletableFuture.completedFuture(tareaRepository.listarTareas());
    }

    @Async
    @Override
    public CompletableFuture<TareaDTO> obtenerTareaPorId(int id) {
        Tareas tarea = tareaRepository.buscarPorId(id);
        return CompletableFuture.completedFuture(toDTO(tarea));
    }

    @Async
    @Override
    public CompletableFuture<RespuestaDTO> crearTarea(CrearTareaDTO crearTareaDTO) {
        Tareas tarea = new Tareas();
        tarea.setTitulo(crearTareaDTO.getTitulo());
        tarea.setDescripcion(crearTareaDTO.getDescripcion());
        tarea.setPrioridad(crearTareaDTO.getPrioridad());
        tarea.setFechaCreacion(LocalDateTime.now());
        tarea.setFechaLimite(crearTareaDTO.getFechaLimite());
        tarea.setEstado("PENDIENTE");
        int resultado = tareaRepository.crearTarea(tarea);
        if (resultado > 0) {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea creada exitosamente", true));
        } else {
            return CompletableFuture.completedFuture(new RespuestaDTO("Error al crear la tarea", false));
        }
    }

    @Async
    @Override
    public CompletableFuture<RespuestaDTO> actualizarTarea(int id, ActualizarTareaDTO actualizarTareaDTO) {
        Tareas tarea = tareaRepository.buscarPorId(id);
        if (tarea == null) {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea no encontrada", false));
        }
        if (actualizarTareaDTO.getTitulo() != null) tarea.setTitulo(actualizarTareaDTO.getTitulo());
        if (actualizarTareaDTO.getDescripcion() != null) tarea.setDescripcion(actualizarTareaDTO.getDescripcion());
        if (actualizarTareaDTO.getPrioridad() != null) tarea.setPrioridad(actualizarTareaDTO.getPrioridad());
        if (actualizarTareaDTO.getFechaLimite() != null) tarea.setFechaLimite(actualizarTareaDTO.getFechaLimite());
        if (actualizarTareaDTO.getEstado() != null) tarea.setEstado(actualizarTareaDTO.getEstado());
        int resultado = tareaRepository.actualizarTarea(tarea);
        if (resultado > 0) {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea actualizada exitosamente", true));
        } else {
            return CompletableFuture.completedFuture(new RespuestaDTO("Error al actualizar la tarea", false));
        }
    }

    @Async
    @Override
    public CompletableFuture<RespuestaDTO> eliminarTarea(int id) {
        int resultado = tareaRepository.eliminarTarea(id);
        if (resultado > 0) {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea eliminada exitosamente", true));
        } else {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea no encontrada", false));
        }
    }

    @Async
    @Override
    public CompletableFuture<List<Tareas>> listarPorEstado(String estado) {
        return CompletableFuture.completedFuture(tareaRepository.listarPorEstado(estado));
    }

    @Async
    @Override
    public CompletableFuture<RespuestaDTO> marcarComoCompletada(int id) {
        int resultado = tareaRepository.marcarComoCompletada(id);
        if (resultado > 0) {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea marcada como completada", true));
        } else {
            return CompletableFuture.completedFuture(new RespuestaDTO("Tarea no encontrada", false));
        }
    }

    @Async
    @Override
    public CompletableFuture<List<Tareas>> listarTareasVencidas() {
        return CompletableFuture.completedFuture(tareaRepository.listarTareasVencidas());
    }
} 
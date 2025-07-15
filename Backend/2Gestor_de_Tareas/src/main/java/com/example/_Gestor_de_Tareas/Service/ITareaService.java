package com.example._Gestor_de_Tareas.Service;

import com.example._Gestor_de_Tareas.DTOs.*;
import com.example._Gestor_de_Tareas.Models.Tareas;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ITareaService {
    CompletableFuture<List<Tareas>> listarTareas();
    CompletableFuture<TareaDTO> obtenerTareaPorId(int id);
    CompletableFuture<RespuestaDTO> crearTarea(CrearTareaDTO crearTareaDTO);
    CompletableFuture<RespuestaDTO> actualizarTarea(int id, ActualizarTareaDTO actualizarTareaDTO);
    CompletableFuture<RespuestaDTO> eliminarTarea(int id);
    CompletableFuture<List<Tareas>> listarPorEstado(String estado);
    CompletableFuture<RespuestaDTO> marcarComoCompletada(int id);
    CompletableFuture<List<Tareas>> listarTareasVencidas();
} 
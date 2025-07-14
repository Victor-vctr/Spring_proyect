package com.example._Gestor_de_Tareas.Repository;

import com.example._Gestor_de_Tareas.Models.Tareas;
import java.util.List;

public interface ITareaRepository {
    List<Tareas> listarTareas();
    Tareas buscarPorId(int id);
    int crearTarea(Tareas tarea);
    int actualizarTarea(Tareas tarea);
    int eliminarTarea(int id);
    List<Tareas> listarPorEstado(String estado);
    int marcarComoCompletada(int id);
    List<Tareas> listarTareasVencidas();
} 
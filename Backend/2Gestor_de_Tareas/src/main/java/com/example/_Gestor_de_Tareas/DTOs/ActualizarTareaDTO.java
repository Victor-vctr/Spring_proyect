package com.example._Gestor_de_Tareas.DTOs;

import java.time.LocalDateTime;

public class ActualizarTareaDTO {
    private String titulo;
    private String descripcion;
    private String prioridad;
    private LocalDateTime fechaLimite;
    private String estado;

    public String getTitulo() { 
        return titulo; 
    }
    public void setTitulo(String titulo) { 
        this.titulo = titulo; 
    }
    public String getDescripcion() { 
        return descripcion; 
    }
    public void setDescripcion(String descripcion) { 
        this.descripcion = descripcion; 
    }
    public String getPrioridad() { 
        return prioridad; 
    }
    public void setPrioridad(String prioridad) { 
        this.prioridad = prioridad; 
    }
    public LocalDateTime getFechaLimite() { 
        return fechaLimite; 
    }
    public void setFechaLimite(LocalDateTime fechaLimite) { 
        this.fechaLimite = fechaLimite; 
    }
    public String getEstado() { 
        return estado; 
    }
    public void setEstado(String estado) { 
        this.estado = estado; 
    }
} 
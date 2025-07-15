package com.example._Gestor_de_Tareas.Repository;

import com.example._Gestor_de_Tareas.Models.Tareas;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class TareaRepository implements ITareaRepository {
    private final JdbcTemplate jdbcTemplate;

    public TareaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static class TareaRowMapper implements RowMapper<Tareas> {
        @Override
        public Tareas mapRow(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
            Tareas tarea = new Tareas();
            tarea.setId(rs.getInt("id"));
            tarea.setTitulo(rs.getString("titulo"));
            tarea.setDescripcion(rs.getString("descripcion"));
            tarea.setEstado(rs.getString("estado"));
            tarea.setPrioridad(rs.getString("prioridad"));
            tarea.setFechaCreacion(rs.getTimestamp("fecha_creacion").toLocalDateTime());
            java.sql.Timestamp fechaLimite = rs.getTimestamp("fecha_limite");
            if (fechaLimite != null) {
                tarea.setFechaLimite(fechaLimite.toLocalDateTime());
            }
            return tarea;
        }
    }

    public List<Tareas> listarTareas() {
        String sql = "SELECT * FROM tareas";
        return jdbcTemplate.query(sql, new TareaRowMapper());
    }

    public Tareas buscarPorId(int id) {
        String sql = "SELECT * FROM tareas WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, new TareaRowMapper());
    }

    public int crearTarea(Tareas tarea) {
        String sql = "INSERT INTO tareas (titulo, descripcion, estado, prioridad, fecha_creacion, fecha_limite) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                Timestamp.valueOf(tarea.getFechaCreacion()),
                tarea.getFechaLimite() != null ? Timestamp.valueOf(tarea.getFechaLimite()) : null
        );
    }

    public int actualizarTarea(Tareas tarea) {
        String sql = "UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_limite = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                tarea.getFechaLimite() != null ? Timestamp.valueOf(tarea.getFechaLimite()) : null,
                tarea.getId()
        );
    }

    public int eliminarTarea(int id) {
        String sql = "DELETE FROM tareas WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public List<Tareas> listarPorEstado(String estado) {
        String sql = "SELECT * FROM tareas WHERE estado = ?";
        return jdbcTemplate.query(sql, new Object[]{estado}, new TareaRowMapper());
    }

    public int marcarComoCompletada(int id) {
        String sql = "UPDATE tareas SET estado = 'completada', fecha_completado = NOW() WHERE id = ? AND estado != 'completada'";
        return jdbcTemplate.update(sql, id);
    }

    public List<Tareas> listarTareasVencidas() {
        String sql = "SELECT * FROM tareas WHERE fecha_limite < NOW() AND estado != 'COMPLETADO'";
        return jdbcTemplate.query(sql, new TareaRowMapper());
    }
}

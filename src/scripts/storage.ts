import type { Formation } from './types';

const STORAGE_KEY = 'tactical-board-formations';

/**
 * Utilidades para persistir formaciones en localStorage
 */
export const storage = {
  /**
   * Obtener todas las formaciones guardadas
   */
  getFormations(): Formation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      console.error('Error al leer formaciones de localStorage');
      return [];
    }
  },

  /**
   * Guardar una formación (crear o actualizar)
   */
  saveFormation(formation: Formation): void {
    try {
      const formations = this.getFormations();
      const index = formations.findIndex((f) => f.id === formation.id);

      const updatedFormation = {
        ...formation,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        formations[index] = updatedFormation;
      } else {
        updatedFormation.createdAt = new Date().toISOString();
        formations.push(updatedFormation);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(formations));
    } catch {
      console.error('Error al guardar formación en localStorage');
    }
  },

  /**
   * Eliminar una formación por ID
   */
  deleteFormation(id: string): void {
    try {
      const formations = this.getFormations().filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formations));
    } catch {
      console.error('Error al eliminar formación de localStorage');
    }
  },

  /**
   * Exportar una formación a JSON string
   */
  exportToJson(formation: Formation): string {
    return JSON.stringify(formation, null, 2);
  },

  /**
   * Importar una formación desde JSON string
   */
  importFromJson(json: string): Formation | null {
    try {
      const data = JSON.parse(json);

      // Validar estructura básica
      if (!data.players || !Array.isArray(data.players)) {
        console.error('Formato de formación inválido');
        return null;
      }

      // Generar nuevo ID para evitar conflictos
      return {
        ...data,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch {
      console.error('Error al parsear JSON de formación');
      return null;
    }
  },

  /**
   * Descargar formación como archivo JSON
   */
  downloadFormation(formation: Formation): void {
    const json = this.exportToJson(formation);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${formation.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

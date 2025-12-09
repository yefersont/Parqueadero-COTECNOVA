import DOMPurify from 'dompurify';

/**
 * Sanitiza texto plano para prevenir XSS (Cross-Site Scripting)
 * ISO 27001 A.14.2.5 - Validación y Sanitización de Entrada
 * 
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto sanitizado sin HTML/scripts
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  // Configuración estricta: solo texto, sin HTML
  return DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [], // No permitir ninguna etiqueta HTML
    ALLOWED_ATTR: [], // No permitir ningún atributo
    KEEP_CONTENT: true // Mantener el contenido de texto
  });
};

/**
 * Sanitiza HTML permitiendo solo etiquetas seguras
 * Usar solo cuando se necesite mostrar HTML formateado
 * 
 * @param {string} html - HTML a sanitizar
 * @returns {string} - HTML sanitizado
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') {
    return html;
  }
  
  // Permitir solo etiquetas básicas de formato
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitiza un número (cédula, teléfono, etc.)
 * Remueve cualquier carácter que no sea número o guión
 * 
 * @param {string|number} value - Valor a sanitizar
 * @returns {string} - Valor sanitizado
 */
export const sanitizeNumber = (value) => {
  if (!value) return value;
  
  const str = String(value);
  // Solo permitir números y guiones
  return str.replace(/[^0-9-]/g, '');
};

export default {
  sanitizeText,
  sanitizeHTML,
  sanitizeNumber
};

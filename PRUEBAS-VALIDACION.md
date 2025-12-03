# 🧪 Guía de Pruebas de Validación
## Sistema de Gestión Vehicular COTECNOVA

**Fecha:** 2025-12-03  
**Objetivo:** Verificar que las validaciones de seguridad funcionen correctamente

---

## 📋 Herramientas Necesarias

- **Postman** o **Insomnia** (para pruebas de API)
- **Navegador** con DevTools (F12)
- **Backend corriendo** en `http://localhost:8000`

---

## 🔒 Prueba 1: Headers de Seguridad HTTP

### **Método:** Usando el Navegador

1. Abre el navegador y presiona **F12** (DevTools)
2. Ve a la pestaña **Network** (Red)
3. Haz login en tu aplicación
4. Busca la petición de login en la lista
5. Haz clic en ella y ve a **Headers** (Cabeceras)
6. En **Response Headers** deberías ver:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'...
```

### **✅ Resultado Esperado:**
Todos los headers de seguridad deben estar presentes en TODAS las respuestas del backend.

---

## 🧪 Prueba 2: Validación de Propietario

### **Endpoint:** `POST http://localhost:8000/api/propietarios`

### **Prueba 2.1: Cédula Inválida (con letras)**

**Request:**
```json
{
  "Cedula_propietario": "123abc456",
  "Nombre_propietario": "Juan",
  "Apellido_propietario": "Pérez",
  "Telefono_propietario": "3001234567",
  "Rol": 1
}
```

**✅ Resultado Esperado:**
```json
{
  "message": "The cedula propietario must be a number.",
  "errors": {
    "Cedula_propietario": ["The cedula propietario must be a number."]
  }
}
```
**Status Code:** `422 Unprocessable Entity`

---

### **Prueba 2.2: Cédula Muy Corta**

**Request:**
```json
{
  "Cedula_propietario": "12345",
  "Nombre_propietario": "Juan",
  "Apellido_propietario": "Pérez",
  "Telefono_propietario": "3001234567",
  "Rol": 1
}
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "Cedula_propietario": ["The cedula propietario must be between 6 and 10 digits."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 2.3: Nombre con Números (XSS Prevention)**

**Request:**
```json
{
  "Cedula_propietario": "1234567890",
  "Nombre_propietario": "Juan123",
  "Apellido_propietario": "Pérez",
  "Telefono_propietario": "3001234567",
  "Rol": 1
}
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "Nombre_propietario": ["The nombre propietario format is invalid."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 2.4: Nombre con Script Malicioso (XSS Attack)**

**Request:**
```json
{
  "Cedula_propietario": "1234567890",
  "Nombre_propietario": "<script>alert('XSS')</script>",
  "Apellido_propietario": "Pérez",
  "Telefono_propietario": "3001234567",
  "Rol": 1
}
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "Nombre_propietario": ["The nombre propietario format is invalid."]
  }
}
```
**Status Code:** `422`
**🛡️ Protección:** ¡XSS bloqueado!

---

### **Prueba 2.5: Teléfono Inválido**

**Request:**
```json
{
  "Cedula_propietario": "1234567890",
  "Nombre_propietario": "Juan",
  "Apellido_propietario": "Pérez",
  "Telefono_propietario": "300123",
  "Rol": 1
}
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "Telefono_propietario": ["The telefono propietario must be 10 digits."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 2.6: Datos Válidos ✅**

**Request:**
```json
{
  "Cedula_propietario": "1234567890",
  "Nombre_propietario": "Juan Carlos",
  "Apellido_propietario": "García Pérez",
  "Telefono_propietario": "3001234567",
  "Rol": 1
}
```

**✅ Resultado Esperado:**
```json
{
  "message": "Propietario creado exitosamente",
  "idPropietario": 123
}
```
**Status Code:** `201 Created`

---

## 🚗 Prueba 3: Validación de Vehículo

### **Endpoint:** `POST http://localhost:8000/api/vehiculos`

### **Prueba 3.1: Placa Formato Incorrecto**

**Request:**
```json
{
  "Tipo_vehiculo": 1,
  "Marca_vehiculo": 1,
  "Placa_vehiculo": "ABC12",
  "Modelo_vehiculo": "2020"
}
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "Placa_vehiculo": ["The placa vehiculo format is invalid."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 3.2: Placa con Minúsculas**

**Request:**
```json
{
  "Tipo_vehiculo": 1,
  "Marca_vehiculo": 1,
  "Placa_vehiculo": "abc123",
  "Modelo_vehiculo": "2020"
}
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "Placa_vehiculo": ["The placa vehiculo format is invalid."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 3.3: Placa Válida ✅**

**Request:**
```json
{
  "Tipo_vehiculo": 1,
  "Marca_vehiculo": 1,
  "Placa_vehiculo": "ABC123",
  "Modelo_vehiculo": "Civic 2020"
}
```

**✅ Resultado Esperado:**
```json
{
  "message": "Vehiculo creado exitosamente",
  "vehiculo": 456
}
```
**Status Code:** `201 Created`

---

## 📅 Prueba 4: Validación de Fechas

### **Endpoint:** `GET http://localhost:8000/api/ingresos/rango-fechas?inicio=2025-12-01&fin=2025-12-03`

### **Prueba 4.1: Formato de Fecha Inválido**

**Request:**
```
GET /api/ingresos/rango-fechas?inicio=01-12-2025&fin=03-12-2025
```

**✅ Resultado Esperado:**
```json
{
  "error": "Datos inválidos",
  "message": "Las fechas deben estar en formato YYYY-MM-DD...",
  "errores": {
    "inicio": ["The inicio does not match the format Y-m-d."],
    "fin": ["The fin does not match the format Y-m-d."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 4.2: Fecha Fin Anterior a Fecha Inicio**

**Request:**
```
GET /api/ingresos/rango-fechas?inicio=2025-12-10&fin=2025-12-01
```

**✅ Resultado Esperado:**
```json
{
  "errors": {
    "fin": ["The fin must be a date after or equal to inicio."]
  }
}
```
**Status Code:** `422`

---

### **Prueba 4.3: Fechas Válidas ✅**

**Request:**
```
GET /api/ingresos/rango-fechas?inicio=2025-12-01&fin=2025-12-03
```

**✅ Resultado Esperado:**
```json
[
  {
    "idIngreso": 1,
    "fecha_ingreso": "2025-12-01",
    ...
  }
]
```
**Status Code:** `200 OK`

---

## 🔐 Prueba 5: Validación de Contraseña (Usuario)

### **Endpoint:** `POST http://localhost:8000/api/usuarios`

### **Prueba 5.1: Contraseña Débil**

**Request:**
```json
{
  "Cedula_usuario": "1234567890",
  "idRol": 1,
  "Nombres": "Admin",
  "email": "admin@test.com",
  "user_usuario": "admin",
  "password": "123456"
}
```

**✅ Resultado Esperado:**
```json
{
  "error": "Datos inválidos",
  "errores": {
    "password": [
      "The password must be at least 8 characters.",
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial (@$!%*#?&)"
    ]
  }
}
```
**Status Code:** `422`

---

### **Prueba 5.2: Contraseña Fuerte ✅**

**Request:**
```json
{
  "Cedula_usuario": "1234567890",
  "idRol": 1,
  "Nombres": "Admin",
  "email": "admin@test.com",
  "user_usuario": "admin",
  "password": "Admin123!@#"
}
```

**✅ Resultado Esperado:**
```json
{
  "message": "Usuario creado exitosamente",
  "usuario": { ... }
}
```
**Status Code:** `201 Created`

---

## 📊 Checklist de Verificación

### Headers de Seguridad
- [ ] X-Frame-Options presente
- [ ] X-Content-Type-Options presente
- [ ] Referrer-Policy presente
- [ ] X-XSS-Protection presente
- [ ] Permissions-Policy presente
- [ ] Content-Security-Policy presente

### Validación de Propietario
- [ ] Rechaza cédula con letras
- [ ] Rechaza cédula < 6 dígitos
- [ ] Rechaza cédula > 10 dígitos
- [ ] Rechaza nombre con números
- [ ] Rechaza nombre con scripts (XSS)
- [ ] Rechaza teléfono != 10 dígitos
- [ ] Acepta datos válidos

### Validación de Vehículo
- [ ] Rechaza placa formato incorrecto
- [ ] Rechaza placa con minúsculas
- [ ] Acepta placa formato ABC123

### Validación de Fechas
- [ ] Rechaza formato incorrecto
- [ ] Rechaza fecha fin < fecha inicio
- [ ] Acepta fechas válidas

### Validación de Contraseña
- [ ] Rechaza contraseña < 8 caracteres
- [ ] Rechaza contraseña sin mayúsculas
- [ ] Rechaza contraseña sin símbolos
- [ ] Acepta contraseña fuerte

---

## 🎯 Resultado Final Esperado

✅ **Todas las validaciones deben funcionar correctamente**  
✅ **Datos inválidos deben ser rechazados con error 422**  
✅ **Datos válidos deben ser aceptados con éxito**  
✅ **Headers de seguridad presentes en todas las respuestas**

---

## 🐛 Si algo no funciona:

1. Verifica que el backend esté corriendo
2. Limpia la caché de Laravel: `php artisan config:clear`
3. Revisa los logs: `Backend/storage/logs/laravel.log`
4. Verifica que los cambios estén guardados

---

**Última actualización:** 2025-12-03  
**Responsable:** Equipo de Desarrollo COTECNOVA

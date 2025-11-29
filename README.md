# Sistema de Gestión de Parqueaderos - COTECNOVA

## 📋 Descripción

Sistema web para la gestión de ingresos y salidas vehiculares de la **Corporación de Estudios Tecnológicos del Norte del Valle (COTECNOVA)**. El sistema permite controlar el acceso al parqueadero del campus universitario, registrar vehículos, propietarios y generar reportes.

## 🔐 Seguridad ISO/IEC 27001

El sistema implementa controles de seguridad alineados con la norma **ISO/IEC 27001** para garantizar la protección de datos personales de estudiantes, docentes y personal administrativo, cumpliendo con la **Ley 1581 de 2012** (Habeas Data) de Colombia.

### Controles de Seguridad Implementados

#### 1. **Bloqueo de Cuenta por Intentos Fallidos** (A.9 - Control de Acceso)
- ✅ Bloqueo automático después de **5 intentos fallidos** de login
- ✅ Cuenta bloqueada por **15 minutos**
- ✅ Reseteo automático del contador en login exitoso
- ✅ Logs de auditoría de todos los intentos de login

#### 2. **Rate Limiting** (A.12 - Seguridad de Operaciones)
- ✅ Límite de **5 intentos de login por minuto** por IP
- ✅ Límite general de **60 peticiones por minuto** en la API
- ✅ Protección contra ataques de fuerza bruta y DoS

#### 3. **Validación Robusta de Inputs** (A.14 - Desarrollo Seguro)
- ✅ Validación estricta contra **SQL Injection**
- ✅ Sanitización de datos de entrada
- ✅ Validación de existencia de registros relacionados
- ✅ Mensajes de error personalizados

#### 4. **Logs de Auditoría Detallados** (A.12.4 - Registro de Eventos)
- ✅ Registro de todas las operaciones críticas
- ✅ Información de IP, usuario, timestamp y acción realizada
- ✅ Logs almacenados en `backend/storage/logs/laravel.log`
- ✅ Trazabilidad completa de actividades

#### 5. **Timeout de Sesión Automático** (A.9.4 - Control de Acceso)
- ✅ Cierre automático de sesión después de **30 minutos de inactividad**
- ✅ Advertencia **2 minutos antes** de la expiración
- ✅ Renovación automática con actividad del usuario

#### 6. **Política de Contraseñas Robustas** (A.9.4.3 - Gestión de Contraseñas)
- ✅ Mínimo **8 caracteres**
- ✅ Al menos **1 mayúscula, 1 minúscula, 1 número y 1 símbolo** (@$!%*#?&)
- ✅ Validación automática en creación y actualización de usuarios
- ✅ Almacenamiento con cifrado bcrypt

---

## 🛠️ Stack Tecnológico

### Backend
- **Laravel 10.x** - Framework PHP
- **MySQL** - Base de datos
- **Laravel Sanctum** - Autenticación API
- **Dompdf** - Generación de reportes PDF

### Frontend
- **React 18** - Librería JavaScript
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **SweetAlert2** - Alertas personalizadas
- **Framer Motion** - Animaciones

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- PHP >= 8.1
- Composer
- Node.js >= 16
- MySQL >= 5.7
- XAMPP o servidor local

### Backend (Laravel)

1. **Clonar el repositorio**
```bash
git clone https://github.com/yefersont/Parqueadero-COTECNOVA.git
cd Parqueadero-COTECNOVA/backend
```

2. **Instalar dependencias**
```bash
composer install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con la configuración de la base de datos:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=parqueadero_cotecnova
DB_USERNAME=root
DB_PASSWORD=
```

4. **Generar clave de aplicación**
```bash
php artisan key:generate
```

5. **Ejecutar migraciones y seeders**
```bash
php artisan migrate:fresh --seed
```

6. **Iniciar servidor**
```bash
php artisan serve
```

El backend estará disponible en: `http://127.0.0.1:8000`

### Frontend (React)

1. **Navegar a la carpeta frontend**
```bash
cd ../frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 👤 Usuarios de Prueba

El sistema incluye usuarios de prueba que **cumplen con la política de contraseñas robustas**:

### Administrador
- **Email:** `admin@cotecnova.edu.co`
- **Usuario:** `admin`
- **Contraseña:** `Admin123!`

### Vigilante/Trabajador
- **Email:** `trabajador@cotecnova.edu.co`
- **Usuario:** `trabajador`
- **Contraseña:** `Trabajador123!`

⚠️ **Nota de Seguridad:** Cambiar estas contraseñas en producción.

---

## 📁 Estructura del Proyecto

```
ProyectoIng/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # Controladores con validación de seguridad
│   │   │   └── Middleware/    # Middleware de autenticación y roles
│   │   └── Models/            # Modelos Eloquent
│   ├── database/
│   │   ├── migrations/        # Migraciones (incluye campos de seguridad)
│   │   └── seeders/           # Seeders con contraseñas seguras
│   └── routes/
│       └── api.php            # Rutas con rate limiting
│
└── frontend/                   # React SPA
    ├── src/
    │   ├── api/               # Configuración de Axios
    │   ├── components/        # Componentes reutilizables
    │   ├── context/           # AuthContext con timeout de sesión
    │   └── pages/             # Páginas de la aplicación
    └── public/
```

---

## 🔑 Funcionalidades Principales

### Para Vigilantes
- ✅ Registrar ingresos vehiculares por cédula
- ✅ Registrar salidas vehiculares automáticas
- ✅ Ver ingresos y salidas del día actual
- ✅ Generar reportes en PDF

### Para Administradores
- ✅ Gestión completa de propietarios (CRUD)
- ✅ Gestión de vehículos y asociaciones
- ✅ Gestión de usuarios del sistema
- ✅ Visualización de estadísticas
- ✅ Filtros avanzados por rango de fechas
- ✅ Exportación de reportes (PDF/Excel)

---

## 📊 Base de Datos

### Tablas Principales
- **usuario** - Usuarios del sistema (con campos de seguridad)
- **propietario** - Propietarios de vehículos (estudiantes, docentes, administrativos)
- **vehiculo** - Vehículos registrados
- **ingreso** - Registros de ingreso al parqueadero
- **salida** - Registros de salida del parqueadero
- **rol** - Roles de usuarios (Administrativo, Trabajador)

### Campos de Seguridad Agregados (ISO 27001)
La tabla `usuario` incluye:
- `failed_attempts` - Contador de intentos fallidos de login
- `locked_until` - Timestamp de bloqueo temporal

---

## 🧪 Pruebas de Seguridad Recomendadas

### 1. Probar Bloqueo de Cuenta
1. Intentar login con contraseña incorrecta 5 veces
2. Verificar mensaje: "Cuenta bloqueada temporalmente..."
3. Esperar 15 minutos y verificar desbloqueo automático

### 2. Probar Rate Limiting
1. Usar Postman para hacer 6 peticiones POST a `/api/login` en menos de 1 minuto
2. Verificar que la 6ta petición devuelve HTTP 429

### 3. Probar Validación de Inputs
1. Intentar búsqueda con cédula inválida: `';DROP TABLE--`
2. Verificar error 400: "Formato de cédula inválido"

### 4. Probar Timeout de Sesión
1. Iniciar sesión
2. No realizar acciones durante 28 minutos
3. Verificar advertencia con countdown
4. Verificar cierre automático a los 30 minutos

### 5. Probar Política de Contraseñas
1. Intentar crear usuario con contraseña débil: `admin123`
2. Verificar rechazo con mensaje de requisitos

---

## 📝 Logs de Auditoría

Los logs se almacenan en `backend/storage/logs/laravel.log` e incluyen:

- ✅ Intentos de login (exitosos y fallidos)
- ✅ Cuentas bloqueadas
- ✅ Creación y actualización de usuarios
- ✅ Registro de ingresos vehiculares
- ✅ Registro de salidas vehiculares
- ✅ Errores de validación

**Ejemplo de log:**
```
[2025-11-28 23:40:00] local.INFO: Login exitoso  
{"usuario_id":1,"email":"admin@cotecnova.edu.co","ip":"127.0.0.1"}
```

---

## 🔒 Política de Contraseñas

### Requisitos
- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 letra mayúscula (A-Z)
- ✅ Al menos 1 letra minúscula (a-z)
- ✅ Al menos 1 número (0-9)
- ✅ Al menos 1 símbolo especial (@$!%*#?&)

### Ejemplos Válidos
- ✅ `Admin123!`
- ✅ `Segura2024@`
- ✅ `MiClave#99`

### Ejemplos NO Válidos
- ❌ `admin123` (falta mayúscula y símbolo)
- ❌ `ADMIN123!` (falta minúscula)
- ❌ `Admin!` (muy corta)

---

## 🌐 API Endpoints

### Autenticación (Pública)
- `POST /api/login` - Login (rate limited: 5/min)

### Usuarios Autenticados
- `GET /api/me` - Información del usuario actual
- `POST /api/logout` - Cerrar sesión
- `GET /api/propietarios/cedula/{cedula}` - Buscar propietario
- `POST /api/ingresos` - Registrar ingreso
- `POST /api/salidas` - Registrar salida
- `GET /api/ingresos/hoy` - Ingresos del día
- `GET /api/salidas/hoy` - Salidas del día

### Solo Administradores
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario
- `POST /api/propietarios` - Crear propietario
- `PUT /api/propietarios/{id}` - Actualizar propietario
- `DELETE /api/propietarios/{id}` - Eliminar propietario

---

## 🛡️ Consideraciones de Seguridad para Producción

### Recomendaciones Adicionales

1. **HTTPS Obligatorio**
   - Configurar certificado SSL/TLS
   - Forzar redirección HTTP → HTTPS

2. **Respaldos Automáticos**
   - Configurar backups diarios de la base de datos
   - Almacenar en ubicación segura off-site

3. **Monitoreo**
   - Implementar alertas para eventos críticos
   - Revisar logs periódicamente

4. **Actualización de Contraseñas**
   - Cambiar contraseñas por defecto del seeder
   - Considerar expiración periódica (cada 90 días)

5. **2FA (Recomendado)**
   - Implementar autenticación de dos factores para administradores

---

## 📞 Soporte y Contacto

**Institución:** Corporación de Estudios Tecnológicos del Norte del Valle - COTECNOVA

**Desarrolladores:**
- Yeferson Tello - [@yefersont](https://github.com/yefersont)

**Repositorio:** [https://github.com/yefersont/Parqueadero-COTECNOVA](https://github.com/yefersont/Parqueadero-COTECNOVA)

---

## 📄 Licencia

Este proyecto es propiedad de COTECNOVA y está desarrollado para uso interno de la institución.

## 🎓 Créditos

Proyecto desarrollado como parte del programa académico de COTECNOVA, implementando estándares de seguridad ISO/IEC 27001 y cumplimiento de la Ley 1581 de 2012 (Habeas Data) de Colombia.

---

**Última actualización:** 28 de noviembre de 2025  
**Versión:** 2.0 - Con mejoras de seguridad ISO 27001

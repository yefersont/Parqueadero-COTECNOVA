# Configuración de Email para Recuperación de Contraseña
# ISO 27001 A.9.4.3

# Agrega estas líneas a tu archivo .env en Backend/

# Para desarrollo con Mailtrap (recomendado para pruebas)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username_mailtrap
MAIL_PASSWORD=tu_password_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@cotecnova.edu.co"
MAIL_FROM_NAME="COTECNOVA Parqueadero"

# URL del frontend (para construir links de recuperación)
FRONTEND_URL=http://localhost:5173

# ============================================
# ALTERNATIVA: Para producción con Gmail
# ============================================
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=tu-email@gmail.com
# MAIL_PASSWORD=tu-app-password  # Contraseña de aplicación de Gmail
# MAIL_ENCRYPTION=tls
# MAIL_FROM_ADDRESS="noreply@cotecnova.edu.co"
# MAIL_FROM_NAME="COTECNOVA Parqueadero"
# FRONTEND_URL=https://tu-dominio.com

# ============================================
# INSTRUCCIONES:
# ============================================
# 
# 1. MAILTRAP (Desarrollo):
#    - Regístrate en https://mailtrap.io (gratis)
#    - Ve a Email Testing > Inboxes > SMTP Settings
#    - Copia Username y Password
#    - Pega los valores arriba
#
# 2. GMAIL (Producción):
#    - Ve a tu cuenta de Google
#    - Seguridad > Verificación en 2 pasos (actívala)
#    - Seguridad > Contraseñas de aplicaciones
#    - Genera una contraseña para "Correo"
#    - Usa esa contraseña en MAIL_PASSWORD
#

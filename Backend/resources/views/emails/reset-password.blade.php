<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña - COTECNOVA</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.95;
        }
        .content {
            padding: 40px 30px;
        }
        .content p {
            color: #374151;
            margin-bottom: 20px;
            font-size: 15px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            box-shadow: 0 6px 8px rgba(5, 150, 105, 0.4);
            transform: translateY(-2px);
        }
        .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
        }
        .warning-box strong {
            display: block;
            margin-bottom: 8px;
            color: #78350f;
        }
        .info-box {
            background-color: #ecfdf5;
            border-left: 4px solid #059669;
            padding: 16px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 5px 0;
            color: #065f46;
            font-size: 13px;
        }
        .info-box strong {
            display: block;
            margin-bottom: 8px;
            color: #064e3b;
            font-size: 14px;
        }
        .link-text {
            word-break: break-all;
            color: #059669;
            font-size: 12px;
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-brand {
            font-weight: 700;
            color: #059669;
            font-size: 16px;
            margin-bottom: 8px;
        }
        .footer p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 13px;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Recuperación de Contraseña</h1>
            <p>Sistema de Gestión Vehicular COTECNOVA</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p class="greeting">Estimado usuario,</p>
            
            <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en el Sistema de Gestión Vehicular de COTECNOVA.</p>
            
            <p>Para crear una nueva contraseña, haga clic en el siguiente botón:</p>
            
            <div class="button-container">
                <a href="{{ $resetUrl }}" class="button">Restablecer Contraseña</a>
            </div>
            
            <div class="warning-box">
                <strong>Importante: Este enlace expirará en 15 minutos</strong>
                <p>Por razones de seguridad, el enlace de recuperación tiene una validez limitada. Si el enlace ha expirado, deberá solicitar uno nuevo.</p>
            </div>
            
            <div class="divider"></div>
            
            <p><strong>Si el botón no funciona,</strong> copie y pegue el siguiente enlace en su navegador:</p>
            <div class="link-text">{{ $resetUrl }}</div>
            
            <div class="info-box">
                <strong>Información de Seguridad:</strong>
                <p>• Si usted no solicitó este cambio, ignore este correo y su contraseña permanecerá sin cambios.</p>
                <p>• Nunca comparta este enlace con otras personas.</p>
                <p>• Este enlace solo puede utilizarse una vez.</p>
                <p>• COTECNOVA nunca le solicitará su contraseña por correo electrónico.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #6b7280;">
                Si tiene alguna pregunta o necesita asistencia, por favor contacte al administrador del sistema.
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-brand">COTECNOVA</p>
            <p>Sistema de Gestión Vehicular</p>
            <p style="margin-top: 15px; font-size: 12px;">
                Este es un correo automático, por favor no responda a este mensaje.
            </p>
            <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
                © {{ date('Y') }} COTECNOVA. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>

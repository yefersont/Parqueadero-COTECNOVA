<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte de Ingresos - {{ now()->format('d/m/Y') }}</title>
  <style>
    body {
      font-family: DejaVu Sans, sans-serif;
      margin: 40px;
      color: #000;
    }

    /* 🔶 Encabezado estilo rectángulo */
    .header-table {
      width: 100%;
      border: 2px solid #000;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .header-table td {
      border-right: 2px solid #000;
      padding: 10px;
      vertical-align: middle;
    }

    .header-left {
      width: 20%;
      text-align: center;
    }

    .logo-box {
      width: 100px;
      height: 100px;
      border: 1px dashed #777;
      margin: 0 auto;
      font-size: 11px;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-right {
      position: relative;
      text-align: center;
    }

    .institution-name {
      font-size: 22px;
      font-weight: bold;
      color: #000;
      margin: 0;
      text-transform: uppercase;
    }

    .institution-sub {
      font-size: 13px;
      color: #333;
      margin: 5px 0 0;
    }

    /* 🕒 Fecha en la esquina superior derecha */
    .report-date {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 11px;
      color: #333;
    }

    /* 🧾 Tabla de ingresos */
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      font-size: 12px;
    }

    th {
      background-color: #f1f1f1;
      color: #000;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }

    .footer {
      text-align: center;
      font-size: 10px;
      color: #555;
      margin-top: 20px;
    }
  </style>
</head>
<body>

<table class="header-table" style="width: 100%; border-collapse: collapse; border: 1px solid black;">
  <tr>
    <td class="header-left" style="width: 20%; text-align: center; border-right: 1px solid black; padding: 10px;">
      <img src="{{ public_path('images/logo.png') }}" alt="Logo COTECNOVA" width="90">
    </td>

    <td class="header-right" style="width: 60%; text-align: center; padding: 10px;">
      <h1 style="margin: 0; font-size: 18px;">COTECNOVA</h1>
      <p style="margin: 0; font-size: 14px;">Sistema de gestión vehicular</p>
    </td>

    <td class="header-date" style="width: 20%; border-left: 1px solid black; text-align: center; vertical-align: middle;">
      <span style="display: inline-block; font-size: 12px; margin-top: 10px;">
        Fecha: {{ now()->format('d/m/Y') }}
      </span>
    </td>
  </tr>
</table>


  <table>
    <thead>
      <tr>
        <th>Propietario</th>
        <th>Cédula</th>
        <th>Placa</th>
        <th>Ingreso</th>
        <th>Salida</th>
      </tr>
    </thead>
    <tbody>
      @forelse ($ingresos as $ingreso)
        <tr>
          <td>{{ $ingreso['nombre'] }} {{ $ingreso['apellido'] }}</td>
          <td>{{ $ingreso['cedula'] }}</td>
          <td>{{ $ingreso['placa'] }}</td>
          <td>
            {{ $ingreso['fecha_ingreso'] }}
            {{ $ingreso['hora_ingreso'] ? ' - '.$ingreso['hora_ingreso'] : '' }}
          </td>
          <td>
            @if ($ingreso['fecha_salida'] || $ingreso['hora_salida'])
              {{ $ingreso['fecha_salida'] }}
              {{ $ingreso['hora_salida'] ? ' - '.$ingreso['hora_salida'] : '' }}
            @else
              —
            @endif
          </td>
        </tr>
      @empty
        <tr>
          <td colspan="6" style="text-align:center;">No hay ingresos registrados para hoy.</td>
        </tr>
      @endforelse
    </tbody>
  </table>

  <p class="footer">
    Generado automáticamente por el Sistema de Gestión Vehicular — {{ now()->format('d/m/Y H:i') }}
  </p>

</body>
</html>

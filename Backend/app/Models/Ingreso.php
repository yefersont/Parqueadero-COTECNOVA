<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Ingreso
 * 
 * @property int $idIngresos
 * @property int $Propietario_idPropietario
 * @property int $Vehiculo_idVehiculo
 * @property Carbon $fecha_ingreso
 * @property Carbon $hora_ingreso
 * 
 * @property Propietario $propietario
 * @property Vehiculo $vehiculo
 * @property Collection|Salida[] $salidas
 *
 * @package App\Models
 */
class Ingreso extends Model
{
	protected $table = 'ingresos';
	protected $primaryKey = 'idIngresos';
	public $timestamps = false;

	protected $casts = [
		'Propietario_idPropietario' => 'int',
		'Vehiculo_idVehiculo' => 'int',
		'fecha_ingreso' => 'datetime',
		'hora_ingreso' => 'datetime'
	];

	protected $fillable = [
		'Propietario_idPropietario',
		'Vehiculo_idVehiculo',
		'fecha_ingreso',
		'hora_ingreso'
	];
	public function getFechaIngresoAttribute($value)
	{
		return Carbon::parse($value)
			->timezone('America/Bogota')
			->format('Y-m-d');
	}

	// Devuelve la hora en formato H:i:s (Bogotá)
	public function getHoraIngresoAttribute($value)
	{
		return Carbon::parse($value)
			->timezone('America/Bogota')
			->format('H:i:s');
	}

	public function propietario()
	{
		return $this->belongsTo(Propietario::class, 'Propietario_idPropietario');
	}

	public function vehiculo()
	{
		return $this->belongsTo(Vehiculo::class, 'Vehiculo_idVehiculo');
	}

	public function salidas()
	{
		return $this->hasOne(Salida::class, 'Ingresos_idIngresos');
	}
}

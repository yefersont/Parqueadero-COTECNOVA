<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Salida
 * 
 * @property int $idSalidas
 * @property int $Ingresos_idIngresos
 * @property Carbon $fecha_salida
 * @property Carbon $hora_salida
 * 
 * @property Ingreso $ingreso
 *
 * @package App\Models
 */
class Salida extends Model
{
	protected $table = 'salidas';
	protected $primaryKey = 'idSalidas';
	public $timestamps = false;

	protected $casts = [
		'Ingresos_idIngresos' => 'int',
		'fecha_salida' => 'date',
		'hora_salida' => 'datetime',
	];

	protected $fillable = [
		'Ingresos_idIngresos',
		'fecha_salida',
		'hora_salida'
	];

	public function ingreso()
	{
		return $this->belongsTo(Ingreso::class, 'Ingresos_idIngresos');
	}

	// Mutator para fecha
	public function getFechaSalidaAttribute($value)
	{
		return Carbon::parse($value)
			->timezone('America/Bogota')
			->format('Y-m-d');
	}

	// Mutator para hora
	public function getHoraSalidaAttribute($value)
	{
		return Carbon::parse($value)
			->timezone('America/Bogota')
			->format('H:i:s');
	}
}

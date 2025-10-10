<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class VehiculoHasPropietario
 * 
 * @property int $Vehiculo_idVehiculo
 * @property int $Propietario_idPropietario
 * 
 * @property Propietario $propietario
 * @property Vehiculo $vehiculo
 *
 * @package App\Models
 */
class VehiculoHasPropietario extends Model
{
	protected $table = 'vehiculo_has_propietario';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Vehiculo_idVehiculo' => 'int',
		'Propietario_idPropietario' => 'int'
	];
	protected $fillable = [
		'Vehiculo_idVehiculo',
		'Propietario_idPropietario',
	];
	public function propietario()
	{
		return $this->belongsTo(Propietario::class, 'Propietario_idPropietario');
	}

	public function vehiculo()
	{
		return $this->belongsTo(Vehiculo::class, 'Vehiculo_idVehiculo');
	}
}

<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Propietario
 * 
 * @property int $idPropietario
 * @property int $Cedula_propietario
 * @property string $Nombre_propietario
 * @property string $Apellido_propietario
 * @property string $Telefono_propietario
 * @property int $Rol
 * 
 * @property Rol $rol
 * @property Collection|Ingreso[] $ingresos
 * @property Collection|Vehiculo[] $vehiculos
 *
 * @package App\Models
 */
class Propietario extends Model
{
	protected $table = 'propietario';
	protected $primaryKey = 'idPropietario';
	public $timestamps = false;

	protected $casts = [
		'Cedula_propietario' => 'int',
		'Rol' => 'int'
	];

	protected $fillable = [
		'Cedula_propietario',
		'Nombre_propietario',
		'Apellido_propietario',
		'Telefono_propietario',
		'Rol'
	];
	protected $hidden = ['Rol'];


	public function rol()
	{
		return $this->belongsTo(Rol::class, 'Rol');
	}

	public function ingresos()
	{
		return $this->hasMany(Ingreso::class, 'Propietario_idPropietario');
	}

	public function vehiculos()
	{
		return $this->belongsToMany(Vehiculo::class, 'vehiculo_has_propietario', 'Propietario_idPropietario', 'Vehiculo_idVehiculo');
	}
}

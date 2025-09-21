<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Vehiculo
 * 
 * @property int $idVehiculo
 * @property int $Tipo_vehiculo
 * @property int $Marca_vehiculo
 * @property string $Placa_vehiculo
 * @property string $Modelo_vehiculo
 * 
 * @property MarcaVehiculo $marca_vehiculo
 * @property TipoVehiculo $tipo_vehiculo
 * @property Collection|Ingreso[] $ingresos
 * @property Collection|Propietario[] $propietarios
 *
 * @package App\Models
 */
class Vehiculo extends Model
{
	protected $table = 'vehiculo';
	protected $primaryKey = 'idVehiculo';
	public $timestamps = false;

	protected $casts = [
		'Tipo_vehiculo' => 'int',
		'Marca_vehiculo' => 'int'
	];

	protected $fillable = [
		'Tipo_vehiculo',
		'Marca_vehiculo',
		'Placa_vehiculo',
		'Modelo_vehiculo'
	];

	public function marca_vehiculo()
	{
		return $this->belongsTo(MarcaVehiculo::class, 'Marca_vehiculo');
	}

	public function tipo_vehiculo()
	{
		return $this->belongsTo(TipoVehiculo::class, 'Tipo_vehiculo');
	}

	public function ingresos()
	{
		return $this->hasMany(Ingreso::class, 'Vehiculo_idVehiculo');
	}

	public function propietarios()
	{
		return $this->belongsToMany(Propietario::class, 'vehiculo_has_propietario', 'Vehiculo_idVehiculo', 'Propietario_idPropietario');
	}
}

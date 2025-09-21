<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class MarcaVehiculo
 * 
 * @property int $idMarca_vehiculo
 * @property string $Marca_vehiculo
 * 
 * @property Collection|Vehiculo[] $vehiculos
 *
 * @package App\Models
 */
class MarcaVehiculo extends Model
{
	protected $table = 'marca_vehiculo';
	protected $primaryKey = 'idMarca_vehiculo';
	public $timestamps = false;

	protected $fillable = [
		'Marca_vehiculo'
	];

	public function vehiculos()
	{
		return $this->hasMany(Vehiculo::class, 'Marca_vehiculo');
	}
}

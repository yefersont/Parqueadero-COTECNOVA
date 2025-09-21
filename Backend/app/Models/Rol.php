<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Rol
 * 
 * @property int $idRol
 * @property string $Rol
 * 
 * @property Collection|Propietario[] $propietarios
 *
 * @package App\Models
 */
class Rol extends Model
{
	protected $table = 'rol';
	protected $primaryKey = 'idRol';
	public $timestamps = false;

	protected $fillable = [
		'Rol'
	];

	public function propietarios()
	{
		return $this->hasMany(Propietario::class, 'Rol');
	}
}

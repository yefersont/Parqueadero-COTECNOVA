<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Usuario
 * 
 * @property int $idUsuario
 * @property int $Cedula_usuario
 * @property string $Nombres
 * @property string $user_usuario
 * @property string $Contraseña_usuario
 *
 * @package App\Models
 */
class Usuario extends Model
{
	protected $table = 'usuario';
	protected $primaryKey = 'idUsuario';
	public $timestamps = false;

	protected $casts = [
		'Cedula_usuario' => 'int'
	];

	protected $fillable = [
		'Cedula_usuario',
		'Nombres',
		'user_usuario',
		'Contraseña_usuario'
	];
}

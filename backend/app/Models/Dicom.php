<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dicom extends Model
{
    protected $table = 'dicom';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = [
        'titulo',
    ];

    public function images()
    {
        return $this->hasMany(Image::class, 'dicom_id', 'id');
    }
}

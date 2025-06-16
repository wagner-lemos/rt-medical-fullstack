<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = ['dicom_id', 'file_path'];

    public function dicom()
    {
        return $this->belongsTo(Dicom::class);
    }
}

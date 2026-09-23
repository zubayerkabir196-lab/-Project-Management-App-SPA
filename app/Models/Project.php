<?php

namespace App\Models;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;
 public function tasks()
{
    return $this->hasMany(Task::class);
}
 public function createdBy(){
    return $this->belongsTo(User::class,'created_by');
 }
 public function UpdatedBy(){
    return $this->belongsTo(User::class,'updated_by');
 }
}

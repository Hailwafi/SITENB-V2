<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostView extends Model
{
    use HasFactory;


    protected $table = 'posts_views';

    protected $fillable = [
        'post_id',
        'views',
    ];}

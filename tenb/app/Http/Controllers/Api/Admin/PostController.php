<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        //get all posts
        $posts = Post::latest()->paginate(5);

        //return collection of posts as a resource
        return new PostResource(true, 'List Data Posts', $posts);
    }

    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'title'       => 'required',
            'slug'        => 'required',
            'category_id' => 'required',
            'user_id'     => 'required',
            'content'     => 'required',
            'image'       => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Upload gambar
        $image = $request->file('image');
        $image->storeAs('public/posts', $image->hashName());

        $category_id = $request->category_id;

        // Dapatkan ID user yang sedang login
        $user_id = Auth::id();

        // Simpan post
        $post = Post::create([
            'title'       => $request->title,
            'slug'        => $request->slug,
            'category_id' => $category_id,
            'user_id'     => $user_id,
            'content'     => $request->content,
            'image'       => $image->hashName(),
        ]);

        return new PostResource(true, 'Data Post Berhasil Ditambahkan', $post);
    }

    public function show($id)
    {
        // Cari post berdasarkan ID
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Kembalikan single post sebagai resource
        return new PostResource(true, 'Detail Data Post', $post);
    }
}

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AttributeController;

Route::middleware('auth:api')->get('/token/revoke', function (Request $request) {
    DB::table('oauth_access_tokens')
        ->where('user_id', $request->user()->id)
        ->update([
            'revoked' => true
        ]);
    return response()->json('DONE');
});

//register
Route::post('/register', function (Request $request) {
    $user = new \App\User();
    $user->name = $request->data['username'];
    $user->email = $request->data['email'];
    $user->password = bcrypt($request->data['password']);
    $user->save();

    return response()->json([
        'message' => "Registro creado con exito"
    ]);
});

//products
Route::group(["prefix" => "product", "middleware" => 'auth:api'], function(){
    Route::get("listCardProduct", [ProductController::class, "index"]);
    Route::get("getInfoProduct/{id?}", [ProductController::class, "getInfoProduct"]);
    Route::delete("delete/{id?}", [ProductController::class, "delete"]);
    Route::post("store", [ProductController::class, "store"]);
    Route::post("update/{id?}", [ProductController::class, "update"]);
});

//attribute
Route::group(["prefix" => "attribute", "middleware" => 'auth:api'], function(){
    Route::get("show/{id?}", [AttributeController::class, "show"]);
    Route::get("index", [AttributeController::class, "index"]);
    Route::get("getType", [AttributeController::class, "getType"]);
    Route::get("getAttributes", [AttributeController::class, "getAttributes"]);
    Route::delete("delete/{id?}", [AttributeController::class, "delete"]);
    Route::post("store", [AttributeController::class, "store"]);
    Route::post("update/{id?}", [AttributeController::class, "update"]);
});




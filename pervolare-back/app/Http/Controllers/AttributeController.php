<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attribute;
use App\Models\Type;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;


class AttributeController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Attribute::withoutTrashed()
        ->join('type as t', 'attribute.type_id', '=', 't.id')
        ->select('attribute.id', 'attribute.name', 't.description', 't.id as type_id', 't.name as name_type')
        ->orderBy('attribute.id', 'desc')
        ->get();     

        return response()->json([
            "data" => $data
        ]);
    }

    /**
     * Get types to attributes
     */
    public function getType(){
        $type = Type::withoutTrashed()
        ->get();

        return response()->json([
            "data" => $type
        ]);
    }

    /**
     * Get attributes with products
     */
    public function getAttributes(){
        $data = DB::table('attribute as a')
        ->join('type as t', 'a.type_id', '=', 't.id')
        ->select('a.id', 'a.name', 't.id as type_id', 't.name as name_type')
        ->whereNull('a.deleted_at')
        ->whereNull('t.deleted_at')
        ->get();

        return response()->json([
            "data" => $data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //Validaciones
        $valid = Attribute::withoutTrashed()
        ->where("name", "=", $request->data['name'])
        ->where("type_id", "=", $request->data['type_id'])
        ->first();

        if(!is_null($valid)){
            return response()->json([
                "type_message" => "error",
                "message"   => "El atributo ingresado ya existe en la base de datos" 
            ]);
        }

        try {
            DB::beginTransaction();

            //se crea nuevo registro
            $attribute = new Attribute();
            $attribute->name = $request->data['name'];
            $attribute->type_id = $request->data['type_id'];

            $attribute->save();

            DB::commit();   

            return response()->json([
                "type_message" => "success",
                "message"   => "Se creo el atributo exitosamente."
            ]);

        }catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "type_message" => "error",
                "message"   => $e->getMessage()
            ]);
        }
    }

     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = DB::table('attribute as a')
        ->join('type as t', 'a.type_id', '=', 't.id')
        ->select('a.id', 'a.name', 't.id as type_id', 't.name as name_type')
        ->where('a.id', '=', $id)
        ->first();

        return response()->json([
            "data" => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
         //Validaciones
         $valid = Attribute::withoutTrashed()
         ->where("name", "=", $request->data['name'])
         ->where("type_id", "=", $request->data['type_id'])
         ->where("id", "!=", $id)
         ->first();
 
         if(!is_null($valid)){
             return response()->json([
                 "type_message" => "error",
                 "message"   => "El atributo ingresado ya existe en la base de datos" 
             ]);
         }
 
         try {
             DB::beginTransaction();
 
             //se crea nuevo registro
             $attribute = Attribute::find($id);
             $attribute->name = $request->data['name'];
             $attribute->type_id = $request->data['type_id'];
 
             $attribute->update();
 
             DB::commit();   
 
             return response()->json([
                 "type_message" => "success",
                 "message"   => "Se actualizo el atributo exitosamente."
             ]);
 
         }catch (\Exception $e) {
             DB::rollBack();
             return response()->json([
                 "type_message" => "error",
                 "message"   => $e->getMessage()
             ]);
         }
    }
    
    /**
     * Delete logic to the registre
     */
    public function delete($id){
        try {
            DB::beginTransaction();

            //se crea nuevo registro
            $attribute = Attribute::find($id);

            $attribute->delete();

            DB::commit();   

            return response()->json([
                "type_message" => "success",
                "message"   => "Se elimino el atributo exitosamente."
            ]);

        }catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "type_message" => "error",
                "message"   => $e->getMessage()
            ]);
        }
    }
    
}

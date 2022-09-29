<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Attribute;
use App\Models\ProductAttribute;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $product = Product::withoutTrashed()->orderby('id', 'desc')->get();

        foreach ($product as $key => $value) {            
            $attribute = DB::table('attribute as a')
                ->join('product_attribute as pa', 'a.id', '=', 'pa.attribute_id')
                ->join('type as t', 'a.type_id', '=', 't.id')
                ->where('pa.product_id', '=', $product[$key]['id'])
                ->whereNull('a.deleted_at')
                ->whereNull('pa.deleted_at')
                ->whereNull('t.deleted_at')
                ->select('a.id', 'a.name', 't.id as type_id', 't.name as name_type')
                ->get();
            
            if(!is_null($attribute)){
                $data [] = array(
                    'id_product'            => $product[$key]['id'],
                    'name_product'          => $product[$key]['name'],
                    'value'                 => $product[$key]['value'],  
                    'description_product'   => $product[$key]['description'],
                    'attributes'            => $attribute
                );
            }else{
                $data [] = array(
                    'id_product'            => $product[$key]['id'],
                    'name_product'          => $product[$key]['name'],
                    'value'                 => $product[$key]['value'],  
                    'description_product'   => $product[$key]['description'],
                );
            }

        }

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
        $validProduct = Product::withoutTrashed()
            ->where("name", "=", $request->data['name'])
            ->where("value", "=", $request->data['value'])
            ->where("description", "=", $request->data['description'])
            ->first();

        if(!is_null($validProduct)){
            return response()->json([
                "type_message" => "error",
                "message"   => "El producto ingresado ya existe en la base de datos" 
            ]);
        }

        try {
            DB::beginTransaction();

            //se crea nuevo producto
            $product = new Product();
            $product->name = $request->data['name'];
            $product->value = $request->data['value'];
            $product->description = $request->data['description'];

            $product->save();

            //Se crean nuevos productos con atributos
            foreach ($request->data['attributes'] as $key => $value) {
                $productoAttribute = new ProductAttribute();
                $productoAttribute->product_id      = $product->id;
                $productoAttribute->attribute_id    = $value['id'];         
                $productoAttribute->save();       
            }

            DB::commit();   

            return response()->json([
                "type_message" => "success",
                "message"   => "Se creo el producto exitosamente."
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
    public function getInfoProduct($id)
    {
        $product = Product::withoutTrashed()
            ->orderby('id', 'desc')
            ->where('id', $id)
            ->get();

        foreach ($product as $key => $value) {            
            $attribute = DB::table('attribute as a')
                ->join('product_attribute as pa', 'a.id', '=', 'pa.attribute_id')
                ->join('type as t', 'a.type_id', '=', 't.id')
                ->where('pa.product_id', '=', $product[$key]['id'])
                ->whereNull('a.deleted_at')
                ->whereNull('pa.deleted_at')
                ->whereNull('t.deleted_at')
                ->select('a.id', 'a.name', 't.id as type_id', 't.name as name_type')
                ->get();
            
            if(!is_null($attribute)){
                $data [] = array(
                    'id_product'            => $product[$key]['id'],
                    'name_product'          => $product[$key]['name'],
                    'value'                 => $product[$key]['value'],  
                    'description_product'   => $product[$key]['description'],
                    'attributes'            => $attribute
                );
            }else{
                $data [] = array(
                    'id_product'            => $product[$key]['id'],
                    'name_product'          => $product[$key]['name'],
                    'value'                 => $product[$key]['value'],  
                    'description_product'   => $product[$key]['description'],
                );
            }

        }

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
        $validProduct = Product::withoutTrashed()
        ->where("name", "=", $request->data['name'])
        ->where("value", "=", $request->data['value'])
        ->where("description", "=", $request->data['description'])
        ->where("id", "!=", $id)
        ->first();

        if(!is_null($validProduct)){
            return response()->json([
                "type_message" => "error",
                "message"   => "El producto ingresado ya existe en la base de datos" 
            ]);
        }

        try {
            DB::beginTransaction();

            //se crea nuevo producto
            $product = Product::find($id);
            $product->name = $request->data['name'];
            $product->value = $request->data['value'];
            $product->description = $request->data['description'];

            $product->update();

            //Valida si han eliminado atributos
            $deleteProductAttribute = ProductAttribute::withoutTrashed()
            ->join('attribute as a', 'product_attribute.attribute_id', '=', 'a.id')
            ->where('product_id', '=', $id)
            ->select('product_attribute.id')
            ->get();

            foreach ($deleteProductAttribute as $key => $valueDelete) {
                $delete = ProductAttribute::find($valueDelete['id']);
                $delete->delete();
            }

            //Se crean nuevos productos con atributos
            foreach ($request->data['attributes'] as $key => $value) {

                $productAttribute = new ProductAttribute();
                $productAttribute->product_id      = $product->id;
                $productAttribute->attribute_id    = $value['id'];         
                $productAttribute->save();             
            }

            DB::commit();   

            return response()->json([
                "type_message" => "success",
                "message"   => "Se actualizo el producto exitosamente."
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
            $product = Product::find($id);

            $product->delete();

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

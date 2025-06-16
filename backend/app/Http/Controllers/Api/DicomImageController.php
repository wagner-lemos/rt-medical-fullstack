<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Dicom;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class DicomImageController extends Controller
{
    public function index()
    {
        $dicom = Dicom::orderBy('id', 'desc')->paginate(10);

        $formattedData = $dicom->map(function ($dicom) {
            return [
                'id' => $dicom->id,
                'titulo' => $dicom->titulo,
            ];
        });

        return response()->json([
            'data' => $formattedData, //$dicom->items(),
            'links' => [
                'first' => $dicom->url(1),
                'last' => $dicom->url($dicom->lastPage()),
                'prev' => $dicom->previousPageUrl(),
                'next' => $dicom->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $dicom->currentPage(),
                'from' => $dicom->firstItem(),
                'last_page' => $dicom->lastPage(),
                'links' => $dicom->links()->elements,
                'path' => $dicom->url(1),
                'per_page' => $dicom->perPage(),
                'to' => $dicom->lastItem(),
                'total' => $dicom->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'imagens' => 'required',
        ]);

        try {
            $data = $request->except('imagens'); // Exclui as imagens do request inicial
            $dicom = Dicom::create($data); // Cria um novo registro usando os dados recebidos

            if ($request->hasFile('imagens')) {
                foreach ($request->file('imagens') as $image) {
                    $path = $image->store('dcm', 'public');
                    Image::create([
                        'dicom_id' => $dicom->id,
                        'file_path' => $path,
                    ]);
                }
            }

            return response()->json($dicom->load('images'), 201); // Retorna a resposta com o registro criado
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422); // Retorna erros de validação, se houver
        }
    }

    public function show($id)
    {
        $model = Dicom::with('images')->find($id);

        if (!$model) {
            return response()->json(['error' => 'Produto não encontrado'], 404);
        }

        return response()->json($model);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
        ]);

	    try {
            $model = Dicom::findOrFail($id);
            $data = $request->except('imagens'); // Exclui as imagens do request inicial
            $model->update($data);

            if ($request->hasFile('imagens')) {
                foreach ($model->images as $image) {
                    Storage::disk('public')->delete($image->file_path);
                    $image->delete();
                }

                foreach ($request->file('imagens') as $image) {
                    $path = $image->store('dcm', 'public');
                    Image::create([
                        'dicom_id' => $model->id,
                        'file_path' => $path,
                    ]);
                }
            }

            return response()->json(['data' => $model->load('images')], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Imagem não encontrada'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $model = Dicom::findOrFail($id);
            
            foreach ($model->images as $image) {
                Storage::disk('public')->delete($image->file_path);
                $image->delete();
            }

            $model->delete();

            return response()->json(['message' => 'Imagem excluído com sucesso'], 202);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Imagem não encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir a imagem'], 400);
        }
    }    
}

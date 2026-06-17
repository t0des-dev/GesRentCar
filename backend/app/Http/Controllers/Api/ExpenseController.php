<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::with('vehicle')->orderBy('expense_date', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->has('month')) {
            $query->whereMonth('expense_date', $request->month);
            if ($request->has('year')) {
                $query->whereYear('expense_date', $request->year);
            }
        }

        return response()->json($query->paginate((int) $request->query('per_page', 50)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date',
            'category' => 'required|string|max:100',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'payment_method' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric',
            'expense_date' => 'sometimes|required|date',
            'category' => 'sometimes|required|string|max:100',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'payment_method' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        return response()->json($expense);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }

    public function uploadReceipt(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $request->validate([
            'receipt' => 'required|file|mimes:jpeg,png,jpg,webp,pdf|max:5120',
        ]);

        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('public/receipts');
            $expense->receipt_url = Storage::url($path);
            $expense->save();

            return response()->json([
                'message' => 'Receipt uploaded successfully',
                'receipt_url' => $expense->receipt_url,
            ]);
        }

        return response()->json(['message' => 'No file provided'], 400);
    }
}

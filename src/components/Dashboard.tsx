import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Ingredient } from '../types';

const Dashboard: React.FC = () => {
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    name: '',
    quantity: 0,
    unit: '',
    category: 'other',
  });

  const categories = {
    vegetable: '채소',
    meat: '고기',
    seafood: '해산물',
    seasoning: '양념',
    grain: '곡물',
    dairy: '유제품',
    other: '기타',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.unit) return;

    if (editingId) {
      updateIngredient(editingId, formData);
      setEditingId(null);
    } else {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: formData.name,
        quantity: formData.quantity,
        unit: formData.unit,
        category: formData.category || 'other',
      };
      addIngredient(newIngredient);
    }

    setFormData({ name: '', quantity: 0, unit: '', category: 'other' });
    setIsAdding(false);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setFormData(ingredient);
    setEditingId(ingredient.id);
    setIsAdding(true);
  };

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">내 식재료 관리</h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition"
          >
            <Plus size={20} />
            재료 추가
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="재료명"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="number"
                placeholder="수량"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <input
                type="text"
                placeholder="단위 (예: g, 개, 큰술)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Ingredient['category'] })}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                {editingId ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ name: '', quantity: 0, unit: '', category: 'other' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {ingredients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">아직 등록된 재료가 없습니다.</p>
            <p className="text-sm">위의 '재료 추가' 버튼을 눌러 재료를 추가해보세요!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedIngredients).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  {categories[category as keyof typeof categories]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{ingredient.name}</h4>
                        <p className="text-sm text-gray-600">
                          {ingredient.quantity} {ingredient.unit}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(ingredient)}
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => removeIngredient(ingredient.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">전체 재료</h3>
          <p className="text-3xl font-bold text-primary-600">{ingredients.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">카테고리</h3>
          <p className="text-3xl font-bold text-primary-600">{Object.keys(groupedIngredients).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">양념류</h3>
          <p className="text-3xl font-bold text-primary-600">
            {groupedIngredients.seasoning?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

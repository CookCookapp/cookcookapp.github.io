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
    <div className="max-w-6xl mx-auto py-4 sm:py-6">
      <div className="card-premium p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">내 식재료</h2>
            <p className="text-sm text-neutral-500">보유 중인 재료를 관리하세요</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus size={20} className="inline mr-2" />
            재료 추가
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-neutral-50 to-white p-4 sm:p-6 rounded-2xl mb-6 border border-neutral-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="재료명"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-premium"
                required
              />
              <input
                type="number"
                placeholder="수량"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="input-premium"
                required
              />
              <input
                type="text"
                placeholder="단위 (예: g, 개, 큰술)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="input-premium"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Ingredient['category'] })}
                className="input-premium"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn-primary flex-1 sm:flex-initial">
                {editingId ? '수정' : '추가'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ name: '', quantity: 0, unit: '', category: 'other' });
                }}
                className="btn-secondary flex-1 sm:flex-initial"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {ingredients.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl flex items-center justify-center">
              <Package size={40} className="text-primary-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2">
              아직 등록된 재료가 없습니다
            </h3>
            <p className="text-sm sm:text-base text-neutral-500">
              '재료 추가' 버튼을 눌러 재료를 추가해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedIngredients).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full mr-3"></div>
                  {categories[category as keyof typeof categories]}
                  <span className="ml-2 text-sm font-normal text-neutral-400">
                    ({items.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {items.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-white border border-neutral-100 rounded-xl p-4 hover:shadow-soft transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900 mb-1">{ingredient.name}</h4>
                          <p className="text-sm text-neutral-500">
                            {ingredient.quantity} {ingredient.unit}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(ingredient)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => removeIngredient(ingredient.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card-premium p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-neutral-500 mb-2">전체 재료</p>
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {ingredients.length}
          </p>
        </div>
        <div className="card-premium p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-neutral-500 mb-2">카테고리</p>
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text text-transparent">
            {Object.keys(groupedIngredients).length}
          </p>
        </div>
        <div className="card-premium p-4 sm:p-6 col-span-2 sm:col-span-1">
          <p className="text-xs sm:text-sm text-neutral-500 mb-2">양념류</p>
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
            {groupedIngredients.seasoning?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

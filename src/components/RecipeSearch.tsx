import React, { useState, useMemo } from 'react';
import { Search, ChefHat, Clock, Users, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RecipeSearch: React.FC = () => {
  const { recipes, startCooking } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const cuisines = useMemo(() => {
    const uniqueCuisines = [...new Set(recipes.map((r) => r.cuisine))];
    return uniqueCuisines;
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCuisine =
        cuisineFilter === 'all' || recipe.cuisine === cuisineFilter;

      const matchesDifficulty =
        difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;

      return matchesSearch && matchesCuisine && matchesDifficulty;
    });
  }, [recipes, searchQuery, cuisineFilter, difficultyFilter]);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const difficultyLabels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">요리 검색</h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="요리 이름, 재료로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition"
        >
          <Filter size={18} />
          <span>필터 {showFilters ? '숨기기' : '표시'}</span>
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="bg-neutral-50 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  요리 종류
                </label>
                <select
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">전체</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  난이도
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full border border-neutral-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">전체</option>
                  <option value="easy">쉬움</option>
                  <option value="medium">보통</option>
                  <option value="hard">어려움</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-neutral-600">
          {filteredRecipes.length}개의 요리를 찾았습니다
        </p>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="bg-white card-premium p-12 text-center">
          <ChefHat size={64} className="mx-auto mb-4 text-neutral-400" />
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-neutral-600">다른 검색어로 다시 시도해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white card-premium overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                <ChefHat size={64} className="text-white opacity-50" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      difficultyColors[recipe.difficulty]
                    }`}
                  >
                    {difficultyLabels[recipe.difficulty]}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                    {recipe.cuisine}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                  {recipe.nameKo}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">{recipe.description}</p>

                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{recipe.cookingTime}분</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{recipe.servings}인분</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-neutral-600 mb-2">
                    필요한 재료: {recipe.ingredients.length}개
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-neutral-100 px-2 py-1 rounded"
                      >
                        {ing.name}
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        +{recipe.ingredients.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => startCooking(recipe)}
                  className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition font-medium"
                >
                  조리 시작하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;

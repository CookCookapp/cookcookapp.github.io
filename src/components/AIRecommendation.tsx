import React, { useState } from 'react';
import { Sparkles, Send, ChefHat, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AIRecommendation: React.FC = () => {
  const { recipes, startCooking } = useApp();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    // Simulate AI search with keyword matching
    setTimeout(() => {
      const keywords = query.toLowerCase();
      const matchedRecipes = recipes.filter((recipe) => {
        const searchText = `${recipe.nameKo} ${recipe.name} ${recipe.cuisine} ${recipe.description}`.toLowerCase();
        return searchText.includes(keywords) ||
          recipe.ingredients.some(ing => ing.name.toLowerCase().includes(keywords)) ||
          (keywords.includes('돼지') && recipe.ingredients.some(ing => ing.name.includes('돼지'))) ||
          (keywords.includes('싱가포르') && recipe.cuisine.toLowerCase().includes('singapore'));
      });

      setResult({
        query,
        recipes: matchedRecipes.slice(0, 3),
        suggestions: matchedRecipes.length > 0 ?
          `"${query}"에 대해 ${matchedRecipes.length}개의 레시피를 찾았습니다.` :
          `죄송합니다. "${query}"에 맞는 레시피를 찾지 못했습니다. 다른 검색어를 시도해보세요.`
      });
      setIsSearching(false);
    }, 1500);
  };

  const exampleQueries = [
    '싱가포르식 돼지고기 조리법을 알려줘',
    '김치로 만들 수 있는 요리',
    '쉽고 빠른 한식 요리',
    '이탈리안 파스타 레시피',
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 mb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={32} />
          <h2 className="text-3xl font-bold">AI 요리 추천</h2>
        </div>
        <p className="text-purple-100">
          원하는 요리나 재료를 말씀해주시면 AI가 최적의 레시피를 추천해드립니다.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white card-premium p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 싱가포르식 돼지고기 조리법을 알려줘"
            className="flex-1 border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader size={20} className="animate-spin" />
                검색중...
              </>
            ) : (
              <>
                <Send size={20} />
                추천받기
              </>
            )}
          </button>
        </form>

        {/* Example Queries */}
        <div className="mt-4">
          <p className="text-sm text-neutral-600 mb-2">예시:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(example)}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full text-neutral-700 transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white card-premium p-6">
          <div className="flex items-start gap-3 mb-6">
            <Sparkles className="text-purple-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">AI 추천 결과</h3>
              <p className="text-neutral-600">{result.suggestions}</p>
            </div>
          </div>

          {result.recipes.length > 0 && (
            <div className="space-y-4">
              {result.recipes.map((recipe: any) => (
                <div
                  key={recipe.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:border-purple-500 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ChefHat size={20} className="text-purple-500" />
                        <h4 className="font-semibold text-neutral-800">
                          {recipe.nameKo}
                        </h4>
                        <span className="text-xs bg-neutral-100 px-2 py-1 rounded">
                          {recipe.cuisine}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <span>{recipe.cookingTime}분</span>
                        <span>{recipe.servings}인분</span>
                        <span>
                          {recipe.difficulty === 'easy' ? '쉬움' :
                           recipe.difficulty === 'medium' ? '보통' : '어려움'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => startCooking(recipe)}
                      className="ml-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition whitespace-nowrap"
                    >
                      조리하기
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-600 mb-2">주요 재료:</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 6).map((ing: any, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                        >
                          {ing.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      {!result && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="font-semibold text-neutral-800 mb-3">AI 추천 기능 사용법</h3>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">1.</span>
              <span>원하는 요리명이나 재료를 자연스럽게 입력하세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">2.</span>
              <span>특정 나라의 요리 스타일을 지정할 수 있습니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">3.</span>
              <span>AI가 데이터베이스에서 최적의 레시피를 찾아드립니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">4.</span>
              <span>마음에 드는 레시피를 선택하여 바로 조리를 시작하세요</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;

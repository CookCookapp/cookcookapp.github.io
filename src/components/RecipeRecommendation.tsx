import React, { useMemo } from 'react';
import { ChefHat, Clock, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RecipeRecommendation: React.FC = () => {
  const { ingredients, recipes, startCooking } = useApp();

  const recommendedRecipes = useMemo(() => {
    return recipes.map((recipe) => {
      const matchingIngredients = recipe.ingredients.filter((recipeIng) =>
        ingredients.some((userIng) =>
          userIng.name.toLowerCase().includes(recipeIng.name.toLowerCase()) ||
          recipeIng.name.toLowerCase().includes(userIng.name.toLowerCase())
        )
      );

      const matchPercentage = Math.round(
        (matchingIngredients.length / recipe.ingredients.length) * 100
      );

      return {
        ...recipe,
        matchPercentage,
        matchingIngredients,
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [ingredients, recipes]);

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">추천 요리</h2>
        <p className="text-gray-600">
          현재 보유 중인 재료 {ingredients.length}개를 기반으로 추천합니다
        </p>
      </div>

      {ingredients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ChefHat size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            재료를 먼저 등록해주세요
          </h3>
          <p className="text-gray-600">
            대시보드에서 재료를 추가하면 맞춤 요리를 추천해드립니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {/* Match Percentage Badge */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <ChefHat size={64} className="text-white opacity-50" />
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="font-bold text-green-600">
                    {recipe.matchPercentage}%
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>
                    {difficultyLabels[recipe.difficulty]}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {recipe.nameKo}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                  <p className="text-sm text-gray-600 mb-2">
                    필요한 재료: {recipe.ingredients.length}개
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {ing.name}
                      </span>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
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

export default RecipeRecommendation;

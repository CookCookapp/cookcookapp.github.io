import React from 'react';
import { Home, UtensilsCrossed, Search, Sparkles, ChefHat } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import RecipeRecommendation from './components/RecipeRecommendation';
import RecipeSearch from './components/RecipeSearch';
import AIRecommendation from './components/AIRecommendation';
import CookingTimer from './components/CookingTimer';
import AdBanner from './components/AdBanner';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, cookingSession } = useApp();

  const navigation = [
    { id: 'dashboard', label: '대시보드', icon: Home },
    { id: 'recommend', label: '요리 추천', icon: UtensilsCrossed },
    { id: 'search', label: '요리 검색', icon: Search },
    { id: 'ai-recommend', label: 'AI 추천', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat size={32} className="text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-800">CookCook</h1>
            </div>
            {cookingSession && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                조리 중: {cookingSession.recipeName}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      {!cookingSession && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="py-6">
        {/* Ad Banner - Top */}
        {!cookingSession && (
          <div className="max-w-7xl mx-auto px-4">
            <AdBanner type="horizontal" position="top" />
          </div>
        )}

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4">
          <div className={cookingSession ? 'w-full' : 'flex gap-6'}>
            {/* Main Content */}
            <div className={cookingSession ? 'w-full' : 'flex-1'}>
              {cookingSession ? (
                <CookingTimer />
              ) : (
                <>
                  {currentView === 'dashboard' && <Dashboard />}
                  {currentView === 'recommend' && <RecipeRecommendation />}
                  {currentView === 'search' && <RecipeSearch />}
                  {currentView === 'ai-recommend' && <AIRecommendation />}
                </>
              )}
            </div>

            {/* Sidebar - only show when not cooking */}
            {!cookingSession && (
              <aside className="w-80 space-y-6">
                <AdBanner type="vertical" position="sidebar" />
                <AdBanner type="vertical" position="sidebar" />
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <span className="font-bold text-primary-600">CookCook</span> - 당신의 재료로 요리를 추천합니다
            </p>
            <p className="text-sm">
              광고 문의 및 파트너십: contact@cookcook.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

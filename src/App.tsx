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
    { id: 'recommend', label: '추천', icon: UtensilsCrossed },
    { id: 'search', label: '검색', icon: Search },
    { id: 'ai-recommend', label: 'AI', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                <ChefHat size={24} className="text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                CookCook
              </h1>
            </div>
            {cookingSession && (
              <div className="hidden sm:flex bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium border border-emerald-100">
                조리 중: {cookingSession.recipeName}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      {!cookingSession && (
        <nav className="bg-white border-b border-neutral-100 sticky top-[72px] sm:top-[80px] z-40">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex justify-around sm:justify-start sm:gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-5 py-3 sm:py-4 font-medium transition-all relative min-w-[70px] sm:min-w-0 ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'scale-110' : ''} />
                    <span className="text-sm sm:text-base">{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="pb-8 sm:pb-12 pt-6">
        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cookingSession ? 'w-full' : 'flex flex-col lg:flex-row gap-6'}>
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
              <aside className="hidden lg:block w-80 space-y-6 flex-shrink-0">
                <AdBanner type="vertical" position="sidebar" />
                <AdBanner type="vertical" position="sidebar" />
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-neutral-600">
            <p className="mb-2 text-sm sm:text-base">
              <span className="font-semibold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                CookCook
              </span>{' '}
              <span className="text-neutral-500">- 당신의 재료로 요리를 추천합니다</span>
            </p>
            <p className="text-xs sm:text-sm text-neutral-400">
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

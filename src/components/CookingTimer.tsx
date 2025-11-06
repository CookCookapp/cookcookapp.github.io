import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, CheckCircle, Clock, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CookingTimer: React.FC = () => {
  const { cookingSession, recipes, nextStep, previousStep, stopCooking, pauseCooking, resumeCooking } = useApp();
  const [elapsedTime, setElapsedTime] = useState(0);

  const recipe = recipes.find((r) => r.id === cookingSession?.recipeId);

  useEffect(() => {
    if (!cookingSession || cookingSession.isPaused || !recipe) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cookingSession, recipe]);

  useEffect(() => {
    if (!cookingSession || !recipe) return;

    const currentStepData = recipe.steps[cookingSession.currentStep];
    if (currentStepData?.alert && currentStepData?.duration) {
      const timer = setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('CookCook 조리 알림', {
            body: currentStepData.instruction,
            icon: '/favicon.ico',
          });
        }
      }, currentStepData.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [cookingSession?.currentStep, recipe]);

  if (!cookingSession || !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-neutral-600">조리 중인 레시피가 없습니다.</p>
      </div>
    );
  }

  const currentStepData = recipe.steps[cookingSession.currentStep];
  const progress = ((cookingSession.currentStep + 1) / recipe.steps.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white card-premium overflow-hidden">
        {/* Header */}
        <div className="bg-primary-500 text-white p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{recipe.nameKo}</h2>
              <p className="text-primary-100">
                {recipe.cuisine} · {recipe.difficulty === 'easy' ? '쉬움' : recipe.difficulty === 'medium' ? '보통' : '어려움'}
              </p>
            </div>
            <button
              onClick={stopCooking}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>경과 시간: {formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell size={18} />
              <span>알림 {recipe.steps.filter(s => s.alert).length}개</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-neutral-200 h-2">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-700">
              단계 {cookingSession.currentStep + 1} / {recipe.steps.length}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={cookingSession.isPaused ? resumeCooking : pauseCooking}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  cookingSession.isPaused
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {cookingSession.isPaused ? (
                  <>
                    <Play size={18} /> 재개
                  </>
                ) : (
                  <>
                    <Pause size={18} /> 일시정지
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-6 mb-6">
            <p className="text-xl text-neutral-800 leading-relaxed">
              {currentStepData.instruction}
            </p>
            {currentStepData.duration && (
              <p className="text-sm text-neutral-600 mt-4">
                예상 소요 시간: {Math.floor(currentStepData.duration / 60)}분 {currentStepData.duration % 60}초
              </p>
            )}
            {currentStepData.ingredients && currentStepData.ingredients.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-neutral-600 mb-2">이 단계에 필요한 재료:</p>
                <div className="flex flex-wrap gap-2">
                  {currentStepData.ingredients.map((ing, idx) => (
                    <span key={idx} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {currentStepData.alert && (
              <div className="mt-4 flex items-center gap-2 text-yellow-600">
                <Bell size={18} />
                <span className="text-sm">이 단계에서 알림이 전송됩니다</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousStep}
              disabled={cookingSession.currentStep === 0}
              className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg flex items-center gap-2 hover:bg-neutral-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              이전 단계
            </button>

            {cookingSession.currentStep === recipe.steps.length - 1 ? (
              <button
                onClick={stopCooking}
                className="px-6 py-3 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
              >
                <CheckCircle size={20} />
                조리 완료
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg flex items-center gap-2 hover:bg-primary-600 transition"
              >
                다음 단계
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* All Steps Overview */}
        <div className="border-t border-neutral-200 p-6 bg-neutral-50">
          <h4 className="font-semibold text-neutral-700 mb-4">전체 조리 과정</h4>
          <div className="space-y-3">
            {recipe.steps.map((step, idx) => (
              <div
                key={step.stepNumber}
                className={`flex items-start gap-3 p-3 rounded-lg transition ${
                  idx === cookingSession.currentStep
                    ? 'bg-primary-100 border-2 border-primary-500'
                    : idx < cookingSession.currentStep
                    ? 'bg-green-50 opacity-60'
                    : 'bg-white'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    idx === cookingSession.currentStep
                      ? 'bg-primary-500 text-white'
                      : idx < cookingSession.currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {idx < cookingSession.currentStep ? <CheckCircle size={18} /> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-700">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingTimer;

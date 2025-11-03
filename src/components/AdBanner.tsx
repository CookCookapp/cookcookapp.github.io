import React from 'react';
import { ExternalLink, ShoppingCart } from 'lucide-react';

interface AdBannerProps {
  type: 'horizontal' | 'vertical';
  position?: 'top' | 'bottom' | 'sidebar';
}

const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  // Sample ad data - in production, this would come from an ad network
  const horizontalAds = [
    {
      id: 1,
      title: '신선한 재료 배송',
      description: '오늘 주문하면 내일 도착! 프리미엄 식재료를 집에서 받아보세요',
      image: '🥬',
      link: '#',
      cta: '지금 주문하기',
    },
    {
      id: 2,
      title: '프리미엄 주방용품 20% 할인',
      description: '요리를 더욱 즐겁게! 최고급 주방도구 특가 세일',
      image: '🔪',
      link: '#',
      cta: '쇼핑하기',
    },
  ];

  const verticalAds = [
    {
      id: 3,
      title: '오늘의 추천 상품',
      description: '프리미엄 올리브오일',
      price: '25,900원',
      image: '🫒',
      link: '#',
    },
    {
      id: 4,
      title: '베스트셀러',
      description: '스테인리스 프라이팬',
      price: '49,000원',
      image: '🍳',
      link: '#',
    },
  ];

  if (type === 'horizontal') {
    const ad = horizontalAds[Math.floor(Math.random() * horizontalAds.length)];
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{ad.image}</div>
            <div>
              <p className="text-xs uppercase tracking-wide opacity-80 mb-1">광고</p>
              <h3 className="text-xl font-bold mb-1">{ad.title}</h3>
              <p className="text-sm opacity-90">{ad.description}</p>
            </div>
          </div>
          <a
            href={ad.link}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 whitespace-nowrap"
          >
            <ShoppingCart size={18} />
            {ad.cta}
          </a>
        </div>
      </div>
    );
  }

  // Vertical ad
  const ad = verticalAds[Math.floor(Math.random() * verticalAds.length)];
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">광고</p>
      <div className="text-center">
        <div className="text-6xl mb-3">{ad.image}</div>
        <h4 className="font-semibold text-gray-800 mb-1">{ad.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
        <p className="text-lg font-bold text-primary-600 mb-3">{ad.price}</p>
        <a
          href={ad.link}
          className="block w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition text-sm font-medium flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          자세히 보기
        </a>
      </div>
    </div>
  );
};

export default AdBanner;

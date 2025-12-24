import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const DemoStorybookPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const storybook = {
    title: '제주도 힐링 여행',
    summary: '푸른 바다와 따뜻한 햇살이 가득한 제주도에서 힐링하는 시간을 보냈습니다.',
    pages: [
      {
        title: '시작하는 여행',
        caption: '설렘 가득한 제주도행 비행기에 오르며, 일상을 벗어나 새로운 여행이 시작됩니다.',
        layout: 'full',
        photo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      },
      {
        title: '푸른 하늘 아래',
        caption: '끝없이 펼쳐진 푸른 바다와 하늘이 만나는 곳에서 깊은 숨을 들이마십니다.',
        layout: 'full',
        photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      },
      {
        title: '자연의 품',
        caption: '제주의 자연은 우리에게 조용히 말을 걸어옵니다. 여유롭게, 천천히.',
        layout: 'two-photos',
        photos: [
          'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
        ],
      },
      {
        title: '바다의 속삭임',
        caption: '파도 소리를 들으며 걷는 해변. 모든 걱정이 바다로 흘러갑니다.',
        layout: 'full',
        photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      },
      {
        title: '작은 순간들',
        caption: '여행의 의미는 큰 계획이 아닌 작은 순간들 속에 숨어 있습니다.',
        layout: 'three-photos',
        photos: [
          'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
          'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400',
        ],
      },
      {
        title: '황금빛 노을',
        caption: '하루의 끝을 노을과 함께 보내며, 이 순간이 영원하기를 바랍니다.',
        layout: 'full',
        photo: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800',
      },
      {
        title: '함께한 시간',
        caption: '소중한 사람들과 함께여서 더욱 특별했던 여행.',
        layout: 'two-photos',
        photos: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        ],
      },
      {
        title: '추억 만들기',
        caption: '카메라에 담지 못한 감정들까지, 모든 것이 추억이 됩니다.',
        layout: 'grid',
        photos: [
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
          'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400',
        ],
      },
      {
        title: '마음의 쉼표',
        caption: '바쁜 일상에서 벗어나 나를 위한 시간, 진정한 휴식을 만끽합니다.',
        layout: 'full',
        photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      },
      {
        title: '다시 만날 날까지',
        caption: '제주도여, 안녕. 다시 돌아올 그날까지 이 추억을 간직할게요.',
        layout: 'full',
        photo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      },
    ],
  };

  const currentPageData = storybook.pages[currentPage];

  const renderLayout = () => {
    switch (currentPageData.layout) {
      case 'full':
        return (
          <div className="aspect-[3/4] rounded-2xl overflow-hidden">
            <img
              src={currentPageData.photo}
              alt={currentPageData.title}
              className="w-full h-full object-cover"
            />
          </div>
        );
      
      case 'two-photos':
        return (
          <div className="grid grid-cols-2 gap-3 aspect-[3/4]">
            {currentPageData.photos?.map((photo, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden">
                <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );
      
      case 'three-photos':
        return (
          <div className="aspect-[3/4] space-y-3">
            <div className="h-1/2 rounded-xl overflow-hidden">
              <img src={currentPageData.photos![0]} alt="Photo 1" className="w-full h-full object-cover" />
            </div>
            <div className="h-1/2 grid grid-cols-2 gap-3">
              {currentPageData.photos?.slice(1, 3).map((photo, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden">
                  <img src={photo} alt={`Photo ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-3 aspect-[3/4]">
            {currentPageData.photos?.map((photo, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden">
                <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">Travel Story</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/demo-trips')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{storybook.title}</h1>
          <p className="text-gray-600 text-lg">{storybook.summary}</p>
        </div>

        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {renderLayout()}

            <div className="text-center space-y-3 py-4">
              <h2 className="text-2xl font-bold text-gray-900">{currentPageData.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                {currentPageData.caption}
              </p>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-500">
                {currentPage + 1} / {storybook.pages.length}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            이전
          </Button>

          <div className="flex gap-2">
            {storybook.pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentPage ? 'bg-gray-900 w-8' : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`}
              />
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={() => setCurrentPage(Math.min(storybook.pages.length - 1, currentPage + 1))}
            disabled={currentPage === storybook.pages.length - 1}
            className="flex items-center gap-2"
          >
            다음
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};






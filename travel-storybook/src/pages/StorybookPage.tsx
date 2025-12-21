import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Storybook, Trip, Photo } from '../types';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const StorybookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      // 여행 정보 로드
      const tripDoc = await getDoc(doc(db, 'trips', id));
      if (tripDoc.exists()) {
        setTrip({ id: tripDoc.id, ...tripDoc.data() } as Trip);
      }

      // 스토리북 로드
      const storybookQuery = query(
        collection(db, 'storybooks'),
        where('tripId', '==', id)
      );
      const storybookSnapshot = await getDocs(storybookQuery);
      
      if (!storybookSnapshot.empty) {
        const storybookData = {
          id: storybookSnapshot.docs[0].id,
          ...storybookSnapshot.docs[0].data()
        } as Storybook;
        setStorybook(storybookData);
      }

      // 사진 로드
      const photosQuery = query(
        collection(db, 'photos'),
        where('tripId', '==', id)
      );
      const photosSnapshot = await getDocs(photosQuery);
      const photosData = photosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setPhotos(photosData);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (storybook && currentPage < storybook.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageLayout = (page: any, pagePhotos: Photo[]) => {
    switch (page.layout) {
      case 'full':
        return (
          <div className="aspect-[3/4] rounded-2xl overflow-hidden">
            {pagePhotos[0] && (
              <img
                src={pagePhotos[0].url}
                alt={page.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      
      case 'two-photos':
        return (
          <div className="grid grid-cols-2 gap-3 aspect-[3/4]">
            {pagePhotos.slice(0, 2).map((photo, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden">
                <img
                  src={photo.url}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        );
      
      case 'three-photos':
        return (
          <div className="aspect-[3/4] space-y-3">
            <div className="h-1/2 rounded-xl overflow-hidden">
              {pagePhotos[0] && (
                <img
                  src={pagePhotos[0].url}
                  alt="Photo 1"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="h-1/2 grid grid-cols-2 gap-3">
              {pagePhotos.slice(1, 3).map((photo, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden">
                  <img
                    src={photo.url}
                    alt={`Photo ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-3 aspect-[3/4]">
            {pagePhotos.slice(0, 4).map((photo, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden">
                <img
                  src={photo.url}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <LoadingSpinner size="lg" text="스토리북 불러오는 중..." />
        </div>
      </div>
    );
  }

  if (!storybook || !trip) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">스토리북을 찾을 수 없습니다.</p>
          <div className="flex justify-center mt-6">
            <Button onClick={() => navigate(`/trip/${id}`)}>
              여행 상세로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentPageData = storybook.pages[currentPage];
  const startPhotoIndex = currentPage * 4;
  const pagePhotos = photos.slice(startPhotoIndex, startPhotoIndex + 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(`/trip/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          여행 상세로 돌아가기
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {trip.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {storybook.summary}
          </p>
        </div>

        {/* 스토리북 페이지 */}
        <Card className="p-8 mb-6">
          <div className="space-y-6">
            {/* 사진 레이아웃 */}
            <div>
              {renderPageLayout(currentPageData, pagePhotos)}
            </div>

            {/* 텍스트 콘텐츠 */}
            <div className="text-center space-y-3 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentPageData.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                {currentPageData.caption}
              </p>
            </div>

            {/* 페이지 번호 */}
            <div className="text-center">
              <span className="text-sm text-gray-500">
                {currentPage + 1} / {storybook.pages.length}
              </span>
            </div>
          </div>
        </Card>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={prevPage}
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
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage
                    ? 'bg-gray-900 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={nextPage}
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


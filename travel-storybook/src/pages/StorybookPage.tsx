import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Storybook, Trip, Photo } from '../types';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';
import { BookPage } from '../components/BookPage';
import { PageTurner } from '../components/PageTurner';
import { ArrowLeft } from 'lucide-react';

export const StorybookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 페이지 컴포넌트 생성
  const pageComponents = storybook.pages.map((page, index) => {
    const startPhotoIndex = index * 4;
    const pagePhotos = photos.slice(startPhotoIndex, startPhotoIndex + 4);
    
    return (
      <BookPage key={index} bookmark={index === 0}>
        <div className="space-y-8 py-8">
          {/* 사진 레이아웃 */}
          <div className="flex justify-center">
            {renderPageLayout(page, pagePhotos)}
          </div>

          {/* 텍스트 콘텐츠 */}
          <div className="text-center space-y-4 py-6 border-t border-paper-300 pt-8">
            <h2 className="book-title text-3xl">
              {page.title}
            </h2>
            <p className="book-text max-w-3xl mx-auto px-4">
              {page.caption}
            </p>
          </div>
        </div>
      </BookPage>
    );
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-8">
        <div className="book-container mb-8">
          <button
            onClick={() => navigate(`/trip/${id}`)}
            className="flex items-center gap-2 text-vintage-brown/70 hover:text-vintage-brown mb-6 transition-colors font-book"
          >
            <ArrowLeft className="w-5 h-5" />
            여행 상세로 돌아가기
          </button>

          <div className="mb-10 pb-6 border-b border-paper-300">
            <h1 className="book-title mb-3">
              {trip.title}
            </h1>
            <p className="book-text text-vintage-brown/80">
              {storybook.summary}
            </p>
          </div>
        </div>

        {/* 페이지 넘김 효과 적용 */}
        <div className="min-h-[80vh]">
          <PageTurner pages={pageComponents} />
        </div>
      </main>
    </div>
  );
};


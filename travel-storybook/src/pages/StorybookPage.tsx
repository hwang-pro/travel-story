import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateStorybook, type StorybookTone } from '../lib/openai';
import { useAuth } from '../hooks/useAuth';
import type { Storybook, Trip, Photo } from '../types';
import { Navbar } from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';
import { BookPage } from '../components/BookPage';
import { PageTurner } from '../components/PageTurner';
import { Card } from '../components/Card';
import { ArrowLeft, Sparkles, RefreshCw, Download, Share2, Calendar } from 'lucide-react';

export const StorybookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [selectedTone, setSelectedTone] = useState<StorybookTone>('calm');

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
        } as Storybook & { generationStatus?: string };
        setStorybook(storybookData as Storybook);
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

  const handleDeleteStorybook = async () => {
    if (!storybook || !trip) return;
    if (!confirm('이 스토리북을 삭제할까요? 삭제 후에는 다시 생성해야 합니다.')) return;

    try {
      await deleteDoc(doc(db, 'storybooks', storybook.id));
      await updateDoc(doc(db, 'trips', trip.id), {
        hasStorybook: false,
      });
      alert('스토리북이 삭제되었습니다.');
      navigate(`/trip/${trip.id}`);
    } catch (error) {
      console.error('스토리북 삭제 오류:', error);
      alert('스토리북 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleRegenerateStorybook = async () => {
    if (!trip || !user || photos.length === 0) {
      alert('스토리북을 재생성할 수 없습니다.');
      return;
    }

    setRegenerating(true);
    setShowToneSelector(false);

    try {
      const response = await generateStorybook({
        tripTitle: trip.title,
        tripDate: trip.date,
        notes: trip.notes || '',
        places: trip.places || [],
        people: trip.members || [],
        photoUrls: photos.map(p => p.url),
        tone: selectedTone,
      });

      // 기존 스토리북 삭제
      if (storybook) {
        await deleteDoc(doc(db, 'storybooks', storybook.id));
      }

      // 새 스토리북 저장
      let generationStatus = 'success';
      try {
        await addDoc(collection(db, 'storybooks'), {
          tripId: id,
          uid: user.uid,
          summary: response.summary,
          pages: response.storybook,
          createdAt: Timestamp.now(),
          tone: selectedTone,
          generationStatus,
        });
      } catch (error) {
        console.error('스토리북 저장 오류:', error);
        generationStatus = 'fallback';
        // 재시도 또는 기본값 저장
        await addDoc(collection(db, 'storybooks'), {
          tripId: id,
          uid: user.uid,
          summary: response.summary || '',
          pages: response.storybook,
          createdAt: Timestamp.now(),
          tone: selectedTone,
          generationStatus,
        });
      }

      // 데이터 다시 로드
      await loadData();
      alert('스토리북이 재생성되었습니다!');
    } catch (error) {
      console.error('스토리북 재생성 오류:', error);
      alert('스토리북 재생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setRegenerating(false);
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
  // 첫 페이지는 커버 페이지 (표지 느낌)
  const coverPage = (
    <BookPage key="cover" bookmark>
      <div className="flex items-center justify-center min-h-full py-12 bg-gradient-to-br from-vintage-brown/5 via-paper-50 to-vintage-tan/10">
        <div className="max-w-2xl w-full px-8">
          <Card className="p-12 bg-gradient-to-br from-paper-50 to-paper-100 border-2 border-vintage-brown/30 shadow-2xl relative overflow-hidden">
            {/* 장식 요소 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-vintage-brown/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-vintage-tan/20 rounded-full -ml-12 -mb-12" />
            
            <div className="relative text-center space-y-8">
              {/* 제목 */}
              <div className="space-y-4">
                <h1 className="book-title text-4xl md:text-5xl text-vintage-brown leading-tight">
                  {trip.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-vintage-brown/70">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg font-book">{trip.date}</span>
                </div>
              </div>
              
              {/* 구분선 */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="h-px bg-vintage-brown/20 flex-1 max-w-24" />
                <Sparkles className="w-6 h-6 text-vintage-brown/40" />
                <div className="h-px bg-vintage-brown/20 flex-1 max-w-24" />
              </div>
              
              {/* 한 줄 요약 */}
              <div className="space-y-3">
                <p className="book-text text-lg md:text-xl leading-relaxed text-vintage-brown/90 px-4 font-medium">
                  {storybook.summary || '여행의 추억이 담긴 순간들...'}
                </p>
              </div>
              
              {/* 하단 장식 */}
              <div className="pt-6 text-sm text-vintage-brown/50 font-book italic">
                여행 기록
              </div>
            </div>
          </Card>
        </div>
      </div>
    </BookPage>
  );

  // 두 번째 페이지는 Summary 강조 카드
  const summaryPage = (
    <BookPage key="summary">
      <div className="flex items-center justify-center min-h-full py-12">
        <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-paper-50 to-paper-100 border-2 border-vintage-brown/20 shadow-lg">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-vintage-brown/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-vintage-brown" />
            </div>
            <h2 className="book-title text-2xl text-vintage-brown mb-4">
              이 여행 한 줄 요약
            </h2>
            <div className="border-t border-paper-300 pt-6">
              <p className="book-text text-lg leading-relaxed text-vintage-brown/90 px-4">
                {storybook.summary || '여행의 추억이 담긴 순간들...'}
              </p>
            </div>
            <div className="pt-4 text-sm text-vintage-brown/60 font-book">
              {trip.title} · {trip.date}
            </div>
          </div>
        </Card>
      </div>
    </BookPage>
  );

  const contentPages = storybook.pages.map((page, index) => {
    // AI가 내려준 photoIndex가 있으면 우선 사용, 없으면 기존 방식으로 fallback
    const indices: number[] =
      Array.isArray((page as any).photoIndex) && (page as any).photoIndex.length > 0
        ? (page as any).photoIndex
        : Array.from({ length: 4 }, (_, i) => index * 4 + i);

    const pagePhotos = indices
      .map((i) => photos[i])
      .filter((p): p is Photo => Boolean(p));

    return (
      <BookPage key={index}>
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

  const pageComponents = [coverPage, summaryPage, ...contentPages];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-8">
        <div className="book-container mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <button
              onClick={() => navigate(`/trip/${id}`)}
              className="flex items-center gap-2 text-vintage-brown/70 hover:text-vintage-brown transition-colors font-book"
            >
              <ArrowLeft className="w-5 h-5" />
              여행 상세로 돌아가기
            </button>
            
            <div className="flex items-center gap-3">
              {!showToneSelector ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      alert('이미지로 저장 기능은 준비 중입니다.');
                    }}
                    className="flex items-center gap-2"
                    disabled={regenerating}
                  >
                    <Download className="w-4 h-4" />
                    이미지로 저장
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('공유 링크가 클립보드에 복사되었습니다!');
                    }}
                    className="flex items-center gap-2"
                    disabled={regenerating}
                  >
                    <Share2 className="w-4 h-4" />
                    공유 링크 복사
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowToneSelector(true)}
                    className="flex items-center gap-2"
                    disabled={regenerating}
                  >
                    <Sparkles className="w-4 h-4" />
                    다시 생성하기
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-300 hover:bg-red-50"
                    onClick={handleDeleteStorybook}
                    disabled={regenerating}
                  >
                    스토리북 삭제
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3 bg-paper-100 p-3 rounded-lg border border-paper-300">
                  <span className="text-sm font-book text-vintage-brown/80">감성 톤 선택:</span>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as StorybookTone)}
                    className="px-3 py-1.5 border border-paper-300 rounded-md bg-white text-sm font-book text-vintage-brown focus:outline-none focus:ring-2 focus:ring-vintage-brown/20"
                  >
                    <option value="calm">잔잔</option>
                    <option value="excited">설렘</option>
                    <option value="healing">힐링</option>
                  </select>
                  <Button
                    variant="primary"
                    onClick={handleRegenerateStorybook}
                    className="flex items-center gap-2"
                    disabled={regenerating}
                  >
                    {regenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        생성하기
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowToneSelector(false)}
                    disabled={regenerating}
                  >
                    취소
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-10 pb-6 border-b border-paper-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="book-title mb-3">
                  {trip.title}
                </h1>
                <p className="book-text text-vintage-brown/70 text-sm mb-3">
                  스토리북을 넘겨보며 여행의 추억을 되새겨보세요
                </p>
                {(storybook as any)?.generationStatus === 'fallback' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    AI 생성 실패 → 기본 스토리북으로 대체됨
                  </div>
                )}
              </div>
            </div>
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


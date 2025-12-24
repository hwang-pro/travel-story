import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateStorybook } from '../lib/openai';
import { useAuth } from '../hooks/useAuth';
import type { Trip, Photo } from '../types';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PhotoUploader } from '../components/PhotoUploader';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [places, setPlaces] = useState('');
  const [members, setMembers] = useState('');

  useEffect(() => {
    loadTrip();
    loadPhotos();
  }, [id]);

  const loadTrip = async () => {
    if (!id) return;

    try {
      const docRef = doc(db, 'trips', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const tripData = { id: docSnap.id, ...docSnap.data() } as Trip;
        setTrip(tripData);
        setTitle(tripData.title);
        setDate(tripData.date);
        setNotes(tripData.notes || '');
        setPlaces(tripData.places?.join(', ') || '');
        setMembers(tripData.members?.join(', ') || '');
      }
    } catch (error) {
      console.error('여행 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    if (!id) return;

    try {
      const q = query(
        collection(db, 'photos'),
        where('tripId', '==', id)
      );
      const querySnapshot = await getDocs(q);
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      
      setPhotos(photosData);
    } catch (error) {
      console.error('사진 로딩 오류:', error);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!id) return;
    const confirmed = confirm('이 사진을 삭제할까요? 삭제 후에는 복구할 수 없습니다.');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'photos', photo.id));
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (error) {
      console.error('사진 삭제 오류:', error);
      alert('사진 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSave = async () => {
    if (!id || !trip) return;

    try {
      await updateDoc(doc(db, 'trips', id), {
        title,
        date,
        notes,
        places: places.split(',').map(p => p.trim()).filter(p => p),
        members: members.split(',').map(m => m.trim()).filter(m => m),
        updatedAt: Timestamp.now(),
      });
      
      alert('저장되었습니다!');
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handlePhotosUploaded = async (urls: string[]) => {
    if (!id || !user) return;

    try {
      for (const url of urls) {
        await addDoc(collection(db, 'photos'), {
          tripId: id,
          uid: user.uid,
          url,
          fileName: url.split('/').pop() || '',
          uploadedAt: Timestamp.now(),
        });
      }
      
      await loadPhotos();
    } catch (error) {
      console.error('사진 저장 오류:', error);
    }
  };

  const handleGenerateStorybook = async () => {
    if (!id || !user || photos.length === 0) {
      alert('먼저 사진을 업로드해주세요!');
      return;
    }

    if (!title.trim()) {
      alert('여행 제목을 입력해주세요!');
      return;
    }

    setGenerating(true);

    try {
      // 먼저 현재 정보 저장
      await handleSave();

      // AI 스토리북 생성
      const response = await generateStorybook({
        tripTitle: title,
        tripDate: date,
        notes: notes,
        places: places.split(',').map(p => p.trim()).filter(p => p),
        people: members.split(',').map(m => m.trim()).filter(m => m),
        photoUrls: photos.map(p => p.url),
      });

      // 스토리북 저장
      await addDoc(collection(db, 'storybooks'), {
        tripId: id,
        uid: user.uid,
        summary: response.summary,
        pages: response.storybook,
        createdAt: Timestamp.now(),
      });

      // 여행 정보 업데이트
      await updateDoc(doc(db, 'trips', id), {
        hasStorybook: true,
      });

      alert('스토리북이 생성되었습니다!');
      navigate(`/trip/${id}/storybook`);
    } catch (error) {
      console.error('스토리북 생성 오류:', error);
      alert('스토리북 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <LoadingSpinner size="lg" text="여행 정보 불러오는 중..." />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">여행을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로 돌아가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 좌측: 사진 업로드 */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                여행 사진
              </h2>
              
              <PhotoUploader
                tripId={id!}
                uid={user!.uid}
                onPhotosUploaded={handlePhotosUploaded}
              />

              {photos.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3">
                    업로드된 사진: {photos.length}개
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          src={photo.url}
                          alt="여행 사진"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo)}
                          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* 우측: 정보 입력 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                여행 정보
              </h2>
              
              <div className="space-y-4">
                <Input
                  label="여행 제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 제주도 힐링 여행"
                />

                <Input
                  label="날짜"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <Input
                  label="장소"
                  value={places}
                  onChange={(e) => setPlaces(e.target.value)}
                  placeholder="예: 제주시, 서귀포시 (쉼표로 구분)"
                />

                <Input
                  label="함께 간 사람"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="예: 친구, 가족 (쉼표로 구분)"
                />

                <Textarea
                  label="메모"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="여행에 대한 간단한 메모를 남겨주세요..."
                  rows={6}
                />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleSave}
              >
                저장하기
              </Button>
              
              <Button
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleGenerateStorybook}
                loading={generating}
                disabled={photos.length === 0}
              >
                <Sparkles className="w-5 h-5" />
                AI 스토리북 생성
              </Button>
            </div>

            {trip.hasStorybook && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/trip/${id}/storybook`)}
              >
                스토리북 보기
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


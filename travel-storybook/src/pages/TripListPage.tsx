import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import type { Trip } from '../types';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Plus, Calendar, Users, CheckCircle2 } from 'lucide-react';

export const TripListPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showStorybooksOnly, setShowStorybooksOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'trips'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
      
      setTrips(tripsData);
    } catch (error) {
      console.error('여행 목록 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    if (!user) return;

    try {
      const newTrip = {
        uid: user.uid,
        title: '새로운 여행',
        date: new Date().toISOString().split('T')[0],
        members: [],
        notes: '',
        places: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        hasStorybook: false,
      };

      const docRef = await addDoc(collection(db, 'trips'), newTrip);
      navigate(`/trip/${docRef.id}`);
    } catch (error) {
      console.error('여행 생성 오류:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <LoadingSpinner size="lg" text="여행 목록 불러오는 중..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="book-container py-12">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-paper-300 gap-4">
          <div>
            <h1 className="book-title mb-2">
              나의 여행
            </h1>
            <p className="book-text text-vintage-brown/70">
              소중한 여행의 추억을 기록하세요
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={showStorybooksOnly ? 'outline' : 'secondary'}
              onClick={() => setShowStorybooksOnly((prev) => !prev)}
              className="text-sm"
            >
              {showStorybooksOnly ? '전체 여행 보기' : '스토리북 여행만 보기'}
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTrip}
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              새 여행 만들기
            </Button>
          </div>
        </div>

        {trips.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-paper-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Plus className="w-12 h-12 text-vintage-brown/50" />
              </div>
              <h3 className="book-title text-2xl mb-3">
                아직 여행이 없습니다
              </h3>
              <p className="book-text mb-8 text-vintage-brown/70">
                첫 번째 여행을 만들어 추억을 기록해보세요
              </p>
              <Button variant="primary" onClick={handleCreateTrip} className="shadow-lg">
                여행 만들기
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips
              .filter((trip) => (showStorybooksOnly ? trip.hasStorybook : true))
              .map((trip) => (
              <Card
                key={trip.id}
                hover
                onClick={() =>
                  navigate(trip.hasStorybook ? `/trip/${trip.id}/storybook` : `/trip/${trip.id}`)
                }
                className="p-6 cursor-pointer relative group page-turn"
              >
                {/* 책갈피 표시 */}
                {trip.hasStorybook && (
                  <div className="absolute top-0 right-0 w-8 h-12 bg-gradient-to-b from-vintage-brown to-vintage-tan shadow-md opacity-80" 
                       style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }} />
                )}
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-book font-semibold text-vintage-brown line-clamp-2 pr-2">
                      {trip.title}
                    </h3>
                    {trip.hasStorybook && (
                      <CheckCircle2 className="w-6 h-6 text-vintage-brown flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-vintage-brown/70">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-book">{trip.date}</span>
                    </div>
                    
                    {trip.members.length > 0 && (
                      <div className="flex items-center gap-2 text-vintage-brown/70">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-book">{trip.members.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {trip.hasStorybook && (
                    <div className="pt-4 border-t border-paper-300">
                      <span className="inline-flex items-center gap-1 text-sm text-vintage-brown font-book font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        스토리북 생성 완료
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};


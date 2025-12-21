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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              나의 여행
            </h1>
            <p className="text-gray-600">
              소중한 여행의 추억을 기록하세요
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={handleCreateTrip}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            새 여행 만들기
          </Button>
        </div>

        {trips.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 여행이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                첫 번째 여행을 만들어 추억을 기록해보세요
              </p>
              <Button variant="primary" onClick={handleCreateTrip}>
                여행 만들기
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                hover
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="p-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {trip.title}
                    </h3>
                    {trip.hasStorybook && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{trip.date}</span>
                    </div>
                    
                    {trip.members.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{trip.members.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {trip.hasStorybook && (
                    <div className="pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
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


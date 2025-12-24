import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Plus, Calendar, Users, CheckCircle2, ArrowLeft } from 'lucide-react';

export const DemoTripsPage = () => {
  const navigate = useNavigate();

  const demoTrips = [
    {
      id: '1',
      title: '제주도 힐링 여행',
      date: '2024-12-10',
      members: ['친구', '가족'],
      hasStorybook: true,
    },
    {
      id: '2',
      title: '서울 감성 카페 투어',
      date: '2024-12-05',
      members: ['친구'],
      hasStorybook: true,
    },
    {
      id: '3',
      title: '부산 바다 여행',
      date: '2024-11-28',
      members: ['연인'],
      hasStorybook: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">Travel Story</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/demo')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              데모 홈
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">나의 여행</h1>
            <p className="text-gray-600">소중한 여행의 추억을 기록하세요</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/demo-detail')} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            새 여행 만들기
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoTrips.map((trip) => (
            <Card
              key={trip.id}
              hover
              onClick={() => trip.hasStorybook ? navigate('/demo-storybook') : navigate('/demo-detail')}
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
      </main>
    </div>
  );
};






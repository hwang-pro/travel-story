import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { ArrowLeft, Upload, Sparkles } from 'lucide-react';

export const DemoDetailPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('제주도 힐링 여행');
  const [date, setDate] = useState('2024-12-10');
  const [places, setPlaces] = useState('제주시, 서귀포시');
  const [members, setMembers] = useState('친구, 가족');
  const [notes, setNotes] = useState('푸른 바다와 따뜻한 햇살이 가득한 제주도에서 힐링하는 시간을 보냈습니다.');

  const demoPhotos = [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400',
  ];

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 좌측: 사진 업로드 */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">여행 사진</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6 hover:border-gray-400 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      사진을 드래그하거나 클릭하세요
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG, WEBP (최대 10MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">업로드된 사진: {demoPhotos.length}개</p>
                <div className="grid grid-cols-3 gap-2">
                  {demoPhotos.map((photo, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`여행 사진 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 우측: 정보 입력 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">여행 정보</h2>
              
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
              <Button variant="secondary" className="flex-1">
                저장하기
              </Button>
              
              <Button
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => navigate('/demo-storybook')}
              >
                <Sparkles className="w-5 h-5" />
                AI 스토리북 생성
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};




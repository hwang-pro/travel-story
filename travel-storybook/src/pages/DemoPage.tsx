import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BookOpen, List, FileText, Sparkles } from 'lucide-react';

export const DemoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-beige-100 via-white to-pastel-pink -z-10" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Story 데모
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI 기반 자동 여행 스토리북 생성 서비스의 각 페이지를 둘러보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 로그인 페이지 */}
          <Card hover className="p-8" onClick={() => navigate('/login')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">로그인 페이지</h3>
              <p className="text-gray-600">
                Google 소셜 로그인<br />
                감성적인 그라데이션 배경
              </p>
              <Button variant="primary" className="w-full">
                보기
              </Button>
            </div>
          </Card>

          {/* 여행 목록 페이지 */}
          <Card hover className="p-8" onClick={() => navigate('/demo-trips')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <List className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">여행 목록</h3>
              <p className="text-gray-600">
                나의 여행들<br />
                카드 형태로 보기
              </p>
              <Button variant="primary" className="w-full">
                보기
              </Button>
            </div>
          </Card>

          {/* 여행 상세 페이지 */}
          <Card hover className="p-8" onClick={() => navigate('/demo-detail')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">여행 상세</h3>
              <p className="text-gray-600">
                사진 업로드<br />
                여행 정보 입력
              </p>
              <Button variant="primary" className="w-full">
                보기
              </Button>
            </div>
          </Card>

          {/* 스토리북 페이지 */}
          <Card hover className="p-8" onClick={() => navigate('/demo-storybook')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">AI 스토리북</h3>
              <p className="text-gray-600">
                10페이지 슬라이드<br />
                감성적인 레이아웃
              </p>
              <Button variant="primary" className="w-full">
                보기
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔐 인증</h4>
              <p className="text-sm text-gray-600">Google 소셜 로그인</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📸 업로드</h4>
              <p className="text-sm text-gray-600">Drag & Drop 사진 업로드</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🤖 AI</h4>
              <p className="text-sm text-gray-600">GPT-4o 스토리 생성</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🎨 디자인</h4>
              <p className="text-sm text-gray-600">미니멀 감성 UI</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};






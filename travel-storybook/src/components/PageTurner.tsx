import { ReactNode, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageTurnerProps {
  pages: ReactNode[];
  onPageChange?: (page: number) => void;
}

export const PageTurner = ({ pages, onPageChange }: PageTurnerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTurning, setIsTurning] = useState(false);

  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage, onPageChange]);

  const nextPage = () => {
    if (currentPage < pages.length - 1 && !isTurning) {
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTurning(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isTurning) {
      setIsTurning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTurning(false);
      }, 300);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress as any);
    return () => window.removeEventListener('keydown', handleKeyPress as any);
  }, [currentPage]);

  return (
    <div className="relative w-full h-full">
      {/* 페이지 표시 */}
      <div className="absolute top-4 right-4 z-10 bg-paper-100/90 px-4 py-2 rounded-md shadow-md">
        <span className="text-sm text-vintage-brown font-book">
          {currentPage + 1} / {pages.length}
        </span>
      </div>

      {/* 현재 페이지 */}
      <div 
        className={`page-turn transition-opacity duration-300 ${isTurning ? 'opacity-0' : 'opacity-100'}`}
      >
        {pages[currentPage]}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 이전 페이지 버튼 */}
        {currentPage > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-paper-100/90 hover:bg-paper-200 p-3 rounded-full shadow-md transition-all hover:scale-110"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-6 h-6 text-vintage-brown" />
          </button>
        )}

        {/* 다음 페이지 버튼 */}
        {currentPage < pages.length - 1 && (
          <button
            onClick={nextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-paper-100/90 hover:bg-paper-200 p-3 rounded-full shadow-md transition-all hover:scale-110"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-6 h-6 text-vintage-brown" />
          </button>
        )}
      </div>

      {/* 페이지 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTurning(true);
              setTimeout(() => {
                setCurrentPage(index);
                setIsTurning(false);
              }, 300);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentPage
                ? 'bg-vintage-brown w-8'
                : 'bg-paper-300 hover:bg-paper-400'
            }`}
            aria-label={`페이지 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


import { type ReactNode } from 'react';

interface BookPageProps {
  children: ReactNode;
  className?: string;
  bookmark?: boolean;
}

export const BookPage = ({ children, className = '', bookmark = false }: BookPageProps) => {
  return (
    <div className={`book-page relative ${className}`}>
      {bookmark && <div className="bookmark" />}
      <div className="book-container">
        {children}
      </div>
    </div>
  );
};



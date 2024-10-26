import { FC } from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-navy-blue text-white ${className}`}>
      <div className="container mx-auto max-w-4xl flex items-center justify-center py-6 md:h-16 md:py-0">
        <p className="text-center text-sm leading-loose px-4">
          Built with love for April, Laila, Eli, and Asher.
        </p>
      </div>
    </footer>
  );
};

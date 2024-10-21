import { FC } from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-navy-blue text-white ${className}`}>
      <div className="container mx-auto max-w-4xl flex items-center justify-center py-10 md:h-24 md:py-0">
        <p className="text-center text-sm leading-loose px-8">
          Built with love for our family recipes.
        </p>
      </div>
    </footer>
  );
};

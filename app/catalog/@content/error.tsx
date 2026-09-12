'use client';

import CatalogError from '@/components/CatalogError/CatalogError';

interface ErrorProps {
  reset: () => void;
}

export default function ContentError({ reset }: ErrorProps) {
  return (
    <CatalogError
      message="Failed to load cars. Please try again later."
      onRetry={reset}
    />
  );
}

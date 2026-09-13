'use client';

import CatalogErrorMessage from '@/components/CatalogError/CatalogError';

interface ErrorProps {
  reset: () => void;
}

export default function CatalogError({ reset }: ErrorProps) {
  return (
    <CatalogErrorMessage
      message="Failed to load the catalog. Please try again later."
      onRetry={reset}
    />
  );
}

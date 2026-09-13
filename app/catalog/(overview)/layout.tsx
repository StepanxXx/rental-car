import css from './CatalogLayout.module.css';
import { Suspense } from 'react';
import CarsLoader from '@/components/CarsLoader/CarsLoader';

export default function CatalogLayout({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <main>
      <h1 className="visually-hidden">Cars catalog</h1>
      <section>
        <div className={`container ${css.catalogContainer}`}>
          <h2 className="visually-hidden">Find your perfect rental car</h2>
          <Suspense fallback={<p> Loading... </p>}>{children}</Suspense>
        </div>
      </section>
      <section>
        <div className={`container ${css.catalogContainer}`}>
          <Suspense fallback={<CarsLoader isActive={true} />}>
            {content}
          </Suspense>
        </div>
      </section>
    </main>
  );
}

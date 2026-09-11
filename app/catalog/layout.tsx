import css from './CatalogLayout.module.css';

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
          {children}
        </div>
      </section>
      <section>
        <div className={`container ${css.catalogContainer}`}>{content}</div>
      </section>
    </main>
  );
}

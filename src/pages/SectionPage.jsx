const SectionPage = ({ title }) => {
  return (
    <section aria-label={`${title} page`}>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </section>
  );
};

export default SectionPage;

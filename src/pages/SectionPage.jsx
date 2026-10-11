const SectionPage = ({ title }) => {
  return (
    <section
      aria-label={`${title} page`}
      className="app-card mx-auto max-w-4xl rounded-[28px] border p-7 shadow-sm sm:p-10"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63824d]">
        Learner workspace
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#173c35]">
        {title}
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-[#64756c]">
        This part of your learning space is being prepared. Your courses,
        checklists, and certificates are ready to explore in the meantime.
      </p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#eff4e3] px-3 py-1.5 text-xs font-semibold text-[#527f69]">
        <span aria-hidden="true" className="size-2 rounded-full bg-[#8cac5b]" />
        Coming soon
      </div>
    </section>
  );
};

export default SectionPage;

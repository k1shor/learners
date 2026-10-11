const Footer = () => {
  return (
    <footer className="app-footer mt-auto border-t">
      <div aria-hidden="true" className="h-1 bg-[#d9ef79]" />
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[#64756c] sm:flex-row sm:px-7 lg:px-10">
        <span className="font-semibold tracking-wide text-[#29483f]">
          E-LearnersHub{" "}
          <span className="font-normal text-[#8a968d]">· A place to grow</span>
        </span>
        <span>© 2026 E-LearnersHub</span>
      </div>
    </footer>
  );
};

export default Footer;

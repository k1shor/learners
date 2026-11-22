import { Link } from 'react-router-dom'

const BrandLogo = ({ to = '/', compact = false, inverted = false }) => (
  <Link
    to={to}
    className="inline-flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
  >
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl ${
        inverted ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
      } ${compact ? 'h-9 w-9' : 'h-10 w-10'}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className={compact ? 'h-5 w-5' : 'h-6 w-6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11.2V16c2.8 2.4 7.2 2.4 10 0v-4.8M21 9v6" />
      </svg>
    </span>
    <span className={`truncate font-extrabold tracking-tight ${inverted ? 'text-white' : 'text-slate-900'} ${compact ? 'text-base' : 'text-lg'}`}>
      Learners<span className={inverted ? 'text-indigo-200' : 'text-indigo-600'}>Hub</span>
    </span>
  </Link>
)

export default BrandLogo

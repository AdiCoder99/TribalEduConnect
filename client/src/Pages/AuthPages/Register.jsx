import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../Context/AppContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/*
  Same tokens as LandingPage. If you use both, move this block into a shared
  CSS file (e.g. tec-theme.css) and import it once in main.jsx.
*/
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@500;700;800&family=Mukta:wght@400;500;600;700&display=swap');
.tec {
  --teal: #0E4D52; --teal-deep: #093A3E; --teal-tint: #E2ECEA;
  --gold: #F2B01E; --gold-dark: #D99A0B; --berry: #9B2257;
  --ink: #12262A; --muted: #4A5F63; --bg: #F6F8F7; --line: #C9D7D4;
  font-family: 'Mukta', system-ui, sans-serif;
  background: var(--bg); color: var(--ink); line-height: 1.6;
}
.tec .display { font-family: 'Bitter', Georgia, serif; letter-spacing: -0.01em; }
.tec .field {
  width: 100%; padding: .7rem .9rem; font-size: 1rem;
  background: #fff; border: 1.5px solid var(--line); border-radius: 4px;
  transition: border-color .15s;
}
.tec .field::placeholder { color: #8CA0A3; }
.tec .field:hover { border-color: #9DB5B1; }
.tec .field:focus { outline: none; border-color: var(--teal); box-shadow: 0 0 0 3px rgba(242,176,30,.45); }
.tec .btn-gold {
  display: flex; align-items: center; justify-content: center; width: 100%;
  padding: .8rem 1.2rem; border-radius: 4px; font-weight: 700; font-size: 1rem;
  background: var(--gold); color: var(--ink); cursor: pointer;
  transition: background-color .15s;
}
.tec .btn-gold:hover:not(:disabled) { background: var(--gold-dark); }
.tec .btn-gold:disabled { opacity: .6; cursor: not-allowed; }
.tec :focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
.tec .dots {
  height: 10px;
  background-image: radial-gradient(circle, var(--gold) 2.2px, transparent 2.7px);
  background-size: 16px 10px; background-repeat: repeat-x; background-position: center;
}
.tec .tricolor {
  height: 4px;
  background: linear-gradient(to right, #FF9933 0 33.3%, #fff 33.3% 66.6%, #138808 66.6% 100%);
}
`;

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Locked to Student
    stCertificateNo: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tec min-h-screen flex flex-col">
      <style>{styles}</style>
      <div className="tricolor" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left: context panel */}
        <aside
          className="lg:col-span-5 flex flex-col justify-between"
          style={{ background: 'var(--teal)', color: '#fff' }}
        >
          <div className="px-6 sm:px-10 pt-8 pb-10 lg:pt-12">
            <Link to="/" className="flex items-center gap-3">
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                <rect width="44" height="44" rx="8" fill="#093A3E" />
                <circle cx="22" cy="22" r="8" fill="#F2B01E" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  return <circle key={i} cx={22 + Math.cos(a) * 14.5} cy={22 + Math.sin(a) * 14.5} r="1.6" fill="#F2B01E" />;
                })}
              </svg>
              <span className="display text-xl font-bold">TribalEduConnect</span>
            </Link>

            <h1 className="display text-3xl sm:text-4xl font-extrabold leading-[1.15] mt-10 lg:mt-16">
              Create your student account
            </h1>
            <p className="mt-4 text-lg max-w-md" style={{ color: '#CFE3E0' }}>
              Registration is free and takes a few minutes. After you sign in you can upload your
              documents once and apply for scholarships.
            </p>

            <div className="mt-8 hidden lg:block max-w-md">
              <p className="font-semibold">Keep these ready</p>
              <ul className="mt-2 space-y-1.5" style={{ color: '#CFE3E0' }}>
                <li>Your Scheduled Tribe (ST) certificate number</li>
                <li>An email address you check regularly</li>
                <li>Your Aadhaar and bank passbook, for the next step</li>
              </ul>
            </div>
          </div>
          <div className="dots hidden lg:block" />
        </aside>

        {/* Right: form */}
        <main className="lg:col-span-7 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-md">
            <h2 className="display text-2xl font-bold">Student registration</h2>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>
              Already registered?{' '}
              <Link to="/login" className="font-semibold underline underline-offset-4" style={{ color: 'var(--teal)' }}>
                Log in
              </Link>
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 px-4 py-3 rounded text-[15px]"
                style={{ background: '#FBE9F1', border: '1px solid #E7B4CB', color: '#6E1640' }}
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="block font-semibold mb-1.5">Full name</label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={update('name')}
                  className="field"
                  placeholder="As written on your certificate"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-semibold mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={update('email')}
                  className="field"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="st" className="block font-semibold mb-1.5">ST certificate number</label>
                <input
                  id="st"
                  type="text"
                  required
                  autoComplete="off"
                  value={formData.stCertificateNo}
                  onChange={update('stCertificateNo')}
                  className="field"
                  placeholder="ST-1092384"
                  aria-describedby="st-help"
                />
                <p id="st-help" className="text-sm mt-1.5" style={{ color: 'var(--muted)' }}>
                  Find this on your caste certificate. It is checked against state records.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={update('password')}
                    className="field"
                    style={{ paddingRight: '3rem' }}
                    placeholder="Choose a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-0 top-0 h-full px-3.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-gold">
                {submitting ? 'Creating your account…' : 'Create account'}
              </button>
            </form>

            <p className="text-sm mt-6" style={{ color: 'var(--muted)' }}>
              Need help? Call the toll-free helpline on 1800-11-0000.
            </p>
            <Link to="/" className="inline-block text-sm mt-3 underline underline-offset-4" style={{ color: 'var(--teal)' }}>
              Back to home page
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
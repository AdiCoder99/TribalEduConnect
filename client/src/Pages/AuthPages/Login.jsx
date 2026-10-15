import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../Context/AppContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/*
  Same tokens as LandingPage and Register. Once all three pages are in place,
  move this block into a shared CSS file and import it once in main.jsx.
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
.tec .seg { display: grid; grid-template-columns: 1fr 1fr; border: 1.5px solid var(--line); border-radius: 4px; overflow: hidden; background: #fff; }
.tec .seg button { padding: .65rem .5rem; font-weight: 600; transition: background-color .15s, color .15s; }
.tec .seg button[aria-pressed="true"] { background: var(--teal); color: #fff; }
.tec .seg button[aria-pressed="false"]:hover { background: var(--teal-tint); }
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

const roleInfo = {
  STUDENT: {
    heading: 'Welcome back',
    text: 'Log in to check your application status, update your documents, or apply for a new scholarship.',
  },
  SCRUTINIZER: {
    heading: 'District officer login',
    text: 'Log in to review student applications and verify documents for your district.',
  },
};

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });
  const info = roleInfo[formData.role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(formData);
      if (!res.success) {
        setError(res.error);
        return;
      }
      // Extract user role safely (handles both uppercase and lowercase DB values)
      const userRole = (res?.user?.role || res?.data?.user?.role || '').toUpperCase();

      // Route based on role
      if (userRole === 'SCRUTINIZER' || userRole === 'OFFICER') {
        navigate('/officer/dashboard');
      } else if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('Login error details:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check credentials.'
      );
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
              {info.heading}
            </h1>
            <p className="mt-4 text-lg max-w-md" style={{ color: '#CFE3E0' }}>
              {info.text}
            </p>
          </div>
          <div className="dots hidden lg:block" />
        </aside>

        {/* Right: form */}
        <main className="lg:col-span-7 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-md">
            <h2 className="display text-2xl font-bold">Log in</h2>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>
              New student?{' '}
              <Link to="/register" className="font-semibold underline underline-offset-4" style={{ color: 'var(--teal)' }}>
                Create an account
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
              <fieldset>
                <legend className="font-semibold mb-1.5">I am a</legend>
                <div className="seg">
                  {[['STUDENT', 'Student'], ['SCRUTINIZER', 'Officer / Scrutinizer']].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={formData.role === value}
                      onClick={() => setFormData({ ...formData, role: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

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
                <label htmlFor="password" className="block font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={update('password')}
                    className="field"
                    style={{ paddingRight: '3rem' }}
                    placeholder="Your password"
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
                {submitting ? 'Logging in…' : 'Log in'}
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

export default Login;
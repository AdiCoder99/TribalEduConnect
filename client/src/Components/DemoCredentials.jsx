import { KeyRound } from 'lucide-react';

const credentials = [
  { role: 'Student', email: 'student@gmail.com', password: 'password123' },
  { role: 'Officer', email: 'verifier@mota.gov.in', password: 'adminpassword' },
  { role: 'Admin', email: 'admin@mota.gov.in', password: 'adminpassword' },
];

const DemoCredentials = ({ onUse }) => (
  <details
    className="fixed bottom-4 right-4 z-40 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-lg"
    style={{ background: '#fff', borderColor: 'var(--line)', color: 'var(--ink)' }}
  >
    <summary
      className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold"
      style={{ background: 'var(--teal-tint)' }}
    >
      <KeyRound className="h-4 w-4" style={{ color: 'var(--teal)' }} />
      Evaluator access
      <span
        className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
        style={{ background: '#C62828' }}
      >
        Evaluator demo
      </span>
    </summary>
    <div className="space-y-3 px-4 py-3 text-sm">
      <p style={{ color: 'var(--muted)' }}>Use these seeded accounts to explore each role.</p>
      {credentials.map((credential) => (
        <div key={credential.email} className="rounded-lg border p-2.5" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between gap-2">
            <strong>{credential.role}</strong>
            {onUse && (
              <button
                type="button"
                onClick={() => onUse(credential)}
                className="rounded px-2 py-1 text-xs font-semibold"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              >
                Use
              </button>
            )}
          </div>
          <div className="mt-1 break-all" style={{ color: 'var(--muted)' }}>
            <div>Email: {credential.email}</div>
            <div>Password: {credential.password}</div>
          </div>
        </div>
      ))}
    </div>
  </details>
);

export default DemoCredentials;

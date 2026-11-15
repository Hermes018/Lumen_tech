/** @purpose Lightweight Node HTTP health/verify entrypoint for Vercel internal auth service */

const ROLES = ['scholar', 'evaluator', 'instructor', 'auditor', 'admin'];

export default function handler(req, res) {
  const payload = JSON.stringify({
    ok: true,
    service: 'lumen-auth',
    roles: ROLES,
    path: req?.url ?? '/',
  });

  if (typeof res.writeHead === 'function') {
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(payload);
    return;
  }

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(200).json({
      ok: true,
      service: 'lumen-auth',
      roles: ROLES,
      path: req?.url ?? '/',
    });
  }
}

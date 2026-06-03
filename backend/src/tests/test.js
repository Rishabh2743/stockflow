'use strict';

const http = require('http');

// ── Config ─────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:5000/api/v1';
let cookie = '';
let productId = '';

// ── Colors ─────────────────────────────────────────────────────────────────────
const green  = (msg) => `\x1b[32m${msg}\x1b[0m`;
const red    = (msg) => `\x1b[31m${msg}\x1b[0m`;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;
const cyan   = (msg) => `\x1b[36m${msg}\x1b[0m`;
const bold   = (msg) => `\x1b[1m${msg}\x1b[0m`;

// ── Stats ──────────────────────────────────────────────────────────────────────
const stats = { passed: 0, failed: 0, total: 0 };

// ── HTTP helper ────────────────────────────────────────────────────────────────
const request = (method, path, body = null, withCookie = false) => {
  return new Promise((resolve, reject) => {
    const url    = new URL(BASE_URL + path);
    const data   = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port:     url.port,
      path:     url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data   ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(withCookie && cookie ? { Cookie: cookie } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        // Capture Set-Cookie
        if (res.headers['set-cookie']) {
          cookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');
        }

        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

// ── Assert helper ──────────────────────────────────────────────────────────────
const assert = (label, condition, detail = '') => {
  stats.total++;
  if (condition) {
    stats.passed++;
    console.log(green(`  ✔ PASS`) + ` — ${label}`);
  } else {
    stats.failed++;
    console.log(red(`  ✘ FAIL`) + ` — ${label}` + (detail ? `\n         ${red(detail)}` : ''));
  }
};

// ── Section header ─────────────────────────────────────────────────────────────
const section = (title) => {
  console.log('\n' + cyan(bold(`━━━ ${title} ━━━`)));
};

// ══════════════════════════════════════════════════════════════════════════════
//  TEST SUITES
// ══════════════════════════════════════════════════════════════════════════════

// ── 1. Health Check ───────────────────────────────────────────────────────────
const testHealth = async () => {
  section('HEALTH CHECK');

  const res = await request('GET', '/../../health');
  // health is at root, not under /api/v1
  const resRoot = await new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: 'localhost', port: 5000, path: '/health', method: 'GET' },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
      }
    );
    req.on('error', reject);
    req.end();
  });

  assert('GET /health returns 200',          resRoot.status === 200);
  assert('health status is healthy',         resRoot.body.status === 'healthy');
  assert('health returns environment field', !!resRoot.body.environment);
  assert('health returns uptime field',      !!resRoot.body.uptime);
};

// ── 2. Auth — Signup ──────────────────────────────────────────────────────────
const testSignup = async () => {
  section('AUTH — SIGNUP');

  const uniqueEmail = `testuser_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}@stockflow.com`;

  const res = await request('POST', '/auth/signup', {
    email: uniqueEmail,
    password: 'Test1234',
    organizationName: 'Test Store',
  });

  assert('POST /auth/signup returns 201',      res.status === 201);
  assert('signup success is true',             res.body.success === true);
  assert('signup returns user object',         !!res.body.data?.user);
  assert('signup returns organization object', !!res.body.data?.organization);
  assert('signup user has email',              res.body.data?.user?.email === uniqueEmail);
  assert('signup user has organizationId',     !!res.body.data?.user?.organizationId);
  assert('cookie is set after signup',         !!cookie);

  // Duplicate email test
  const dup = await request('POST', '/auth/signup', {
    email: uniqueEmail,
    password: 'Test1234',
    organizationName: 'Dup Store',
  });

  assert('duplicate email returns 409', dup.status === 409);
  assert('duplicate email returns error', dup.body.success === false);

  // Validation test
  const bad = await request('POST', '/auth/signup', {
    email: 'bademail',
    password: '123',
  });

  assert('invalid signup returns 422', bad.status === 422);
  assert('invalid signup returns errors array', Array.isArray(bad.body.errors));
};
// ── 3. Auth — Login ───────────────────────────────────────────────────────────
const testLogin = async () => {
  section('AUTH — LOGIN');

  // Create a known user first
  const email    = `login_${Date.now()}@stockflow.com`;
  const password = 'Test1234';

  await request('POST', '/auth/signup', {
    email,
    password,
    organizationName: 'Login Test Org',
  });

  // Clear cookie to test fresh login
  cookie = '';

  const res = await request('POST', '/auth/login', { email, password });
  assert('POST /auth/login returns 200',     res.status === 200);
  assert('login success is true',            res.body.success === true);
  assert('login returns user object',        !!res.body.data?.user);
  assert('cookie is set after login',        !!cookie);

  // Wrong password
  const bad = await request('POST', '/auth/login', { email, password: 'WrongPass' });
  assert('wrong password returns 401',       bad.status === 401);
  assert('wrong password success is false',  bad.body.success === false);

  // Wrong email
  const noUser = await request('POST', '/auth/login', { email: 'nobody@x.com', password: 'Test1234' });
  assert('unknown email returns 401',        noUser.status === 401);
};

// ── 4. Auth — Get Me ──────────────────────────────────────────────────────────
const testGetMe = async () => {
  section('AUTH — GET ME');

  const res = await request('GET', '/auth/me', null, true);
  assert('GET /auth/me returns 200',         res.status === 200);
  assert('me returns user object',           !!res.body.data?.user);
  assert('me returns email',                 !!res.body.data?.user?.email);
  assert('me returns organization',          !!res.body.data?.user?.organization);

  // Without cookie
  const saved = cookie;
  cookie = '';
  const unauth = await request('GET', '/auth/me', null, false);
  assert('GET /auth/me without cookie = 401', unauth.status === 401);
  cookie = saved;
};

// ── 5. Products — Create ──────────────────────────────────────────────────────
const testCreateProduct = async () => {
  section('PRODUCTS — CREATE');

  const res = await request('POST', '/products', {
    name:              'Blue Cotton T-Shirt',
    sku:               `SKU-${Date.now()}`,
    description:       'A nice blue t-shirt',
    quantityOnHand:    50,
    costPrice:         5.99,
    sellingPrice:      19.99,
    lowStockThreshold: 10,
  }, true);

  assert('POST /products returns 201',           res.status === 201);
  assert('create product success is true',       res.body.success === true);
  assert('create product returns id',            !!res.body.data?.id);
  assert('create product returns name',          res.body.data?.name === 'Blue Cotton T-Shirt');
  assert('create product returns sku',           !!res.body.data?.sku);
  assert('create product returns quantityOnHand', res.body.data?.quantityOnHand === 50);

  // Save for later tests
  productId = res.body.data?.id;

  // Duplicate SKU
  const dup = await request('POST', '/products', {
    name: 'Another Product',
    sku:  res.body.data?.sku,
  }, true);
  assert('duplicate SKU returns 409',            dup.status === 409);

  // Missing required fields
  const bad = await request('POST', '/products', { description: 'no name no sku' }, true);
  assert('missing name/sku returns 422',         bad.status === 422);

  // Minimal product (only name + sku)
  const minimal = await request('POST', '/products', {
    name: 'Minimal Product',
    sku:  `MIN-${Date.now()}`,
  }, true);
  assert('minimal product creation returns 201', minimal.status === 201);
};

// ── 6. Products — Get All ─────────────────────────────────────────────────────
const testGetProducts = async () => {
  section('PRODUCTS — GET ALL');

  const res = await request('GET', '/products', null, true);
  assert('GET /products returns 200',            res.status === 200);
  assert('products success is true',             res.body.success === true);
  assert('products returns array',               Array.isArray(res.body.data));
  assert('products returns meta object',         !!res.body.meta);
  assert('meta has total field',                 typeof res.body.meta?.total === 'number');
  assert('meta has page field',                  typeof res.body.meta?.page === 'number');
  assert('meta has totalPages field',            typeof res.body.meta?.totalPages === 'number');

  // Pagination
  const paged = await request('GET', '/products?page=1&limit=2', null, true);
  assert('pagination returns max 2 items',       paged.body.data?.length <= 2);

  // Search
  const searched = await request('GET', '/products?search=Blue', null, true);
  assert('search returns 200',                   searched.status === 200);
  assert('search returns array',                 Array.isArray(searched.body.data));

  // Without cookie
  const saved = cookie;
  cookie = '';
  const unauth = await request('GET', '/products', null, false);
  assert('GET /products without cookie = 401',   unauth.status === 401);
  cookie = saved;
};

// ── 7. Products — Get By ID ───────────────────────────────────────────────────
const testGetProductById = async () => {
  section('PRODUCTS — GET BY ID');

  const res = await request('GET', `/products/${productId}`, null, true);
  assert('GET /products/:id returns 200',        res.status === 200);
  assert('product by id returns correct id',     res.body.data?.id === productId);
  assert('product by id returns name',           !!res.body.data?.name);

  // Non-existent ID
  const notFound = await request('GET', '/products/nonexistent-id-999', null, true);
  assert('non-existent product returns 404',     notFound.status === 404);
};

// ── 8. Products — Update ──────────────────────────────────────────────────────
const testUpdateProduct = async () => {
  section('PRODUCTS — UPDATE');

  const res = await request('PUT', `/products/${productId}`, {
    name:         'Updated T-Shirt',
    sellingPrice: 24.99,
    lowStockThreshold: 5,
  }, true);

  assert('PUT /products/:id returns 200',        res.status === 200);
  assert('update returns updated name',          res.body.data?.name === 'Updated T-Shirt');
  assert('update returns updated price',         res.body.data?.sellingPrice === 24.99);

  // Non-existent product
  const notFound = await request('PUT', '/products/nonexistent-id', { name: 'X' }, true);
  assert('update non-existent returns 404',      notFound.status === 404);
};

// ── 9. Products — Adjust Stock ────────────────────────────────────────────────
const testAdjustStock = async () => {
  section('PRODUCTS — ADJUST STOCK');

  // Add stock
  const add = await request('PATCH', `/products/${productId}/adjust-stock`, {
    adjustment: 20,
    note: 'Restocked from supplier',
  }, true);
  assert('PATCH adjust-stock +20 returns 200',   add.status === 200);
  assert('quantity increased by 20',             add.body.data?.quantityOnHand === 70);

  // Remove stock
  const remove = await request('PATCH', `/products/${productId}/adjust-stock`, {
    adjustment: -10,
    note: 'Damaged items removed',
  }, true);
  assert('PATCH adjust-stock -10 returns 200',   remove.status === 200);
  assert('quantity decreased by 10',             remove.body.data?.quantityOnHand === 60);

  // Goes negative — should fail
  const negative = await request('PATCH', `/products/${productId}/adjust-stock`, {
    adjustment: -99999,
    note: 'Should fail',
  }, true);
  assert('negative stock adjustment returns 409', negative.status === 409);

  // Missing adjustment field
  const bad = await request('PATCH', `/products/${productId}/adjust-stock`, { note: 'no value' }, true);
  assert('missing adjustment returns 422',        bad.status === 422);
};

// ── 10. Dashboard ─────────────────────────────────────────────────────────────
const testDashboard = async () => {
  section('DASHBOARD');

  const res = await request('GET', '/dashboard', null, true);
  assert('GET /dashboard returns 200',           res.status === 200);
  assert('dashboard success is true',            res.body.success === true);
  assert('dashboard returns totalProducts',      typeof res.body.data?.totalProducts === 'number');
  assert('dashboard returns totalUnits',         typeof res.body.data?.totalUnits === 'number');
  assert('dashboard returns totalInventoryValue', typeof res.body.data?.totalInventoryValue === 'number');
  assert('dashboard returns lowStockCount',      typeof res.body.data?.lowStockCount === 'number');
  assert('dashboard returns lowStockItems array', Array.isArray(res.body.data?.lowStockItems));
  assert('dashboard totalProducts >= 1',         res.body.data?.totalProducts >= 1);

  // Without cookie
  const saved = cookie;
  cookie = '';
  const unauth = await request('GET', '/dashboard', null, false);
  assert('GET /dashboard without cookie = 401',  unauth.status === 401);
  cookie = saved;
};

// ── 11. Settings ──────────────────────────────────────────────────────────────
const testSettings = async () => {
  section('SETTINGS');

  // Get settings
  const get = await request('GET', '/settings', null, true);
  assert('GET /settings returns 200',                    get.status === 200);
  assert('settings success is true',                     get.body.success === true);
  assert('settings returns defaultLowStockThreshold',    typeof get.body.data?.defaultLowStockThreshold === 'number');
  assert('settings returns org name',                    !!get.body.data?.name);

  // Update settings
  const update = await request('PUT', '/settings', { defaultLowStockThreshold: 15 }, true);
  assert('PUT /settings returns 200',                    update.status === 200);
  assert('settings updated to 15',                       update.body.data?.defaultLowStockThreshold === 15);

  // Invalid threshold
  const bad = await request('PUT', '/settings', { defaultLowStockThreshold: -5 }, true);
  assert('negative threshold returns 422',               bad.status === 422);

  // Missing threshold
  const missing = await request('PUT', '/settings', {}, true);
  assert('missing threshold returns 422',                missing.status === 422);

  // Without cookie
  const saved = cookie;
  cookie = '';
  const unauth = await request('GET', '/settings', null, false);
  assert('GET /settings without cookie = 401',           unauth.status === 401);
  cookie = saved;
};

// ── 12. Products — Delete ─────────────────────────────────────────────────────
const testDeleteProduct = async () => {
  section('PRODUCTS — DELETE');

  const res = await request('DELETE', `/products/${productId}`, null, true);
  assert('DELETE /products/:id returns 200',     res.status === 200);
  assert('delete success is true',               res.body.success === true);

  // Confirm it's gone
  const gone = await request('GET', `/products/${productId}`, null, true);
  assert('deleted product returns 404',          gone.status === 404);

  // Delete non-existent
  const notFound = await request('DELETE', '/products/nonexistent-id', null, true);
  assert('delete non-existent returns 404',      notFound.status === 404);
};

// ── 13. Auth — Logout ─────────────────────────────────────────────────────────
const testLogout = async () => {
  section('AUTH — LOGOUT');

  const res = await request('POST', '/auth/logout', null, true);
  assert('POST /auth/logout returns 200',        res.status === 200);
  assert('logout success is true',               res.body.success === true);

  // After logout, protected routes should fail
  cookie = '';
  const unauth = await request('GET', '/auth/me', null, false);
  assert('GET /auth/me after logout = 401',      unauth.status === 401);
};

// ── 14. Unknown Route ─────────────────────────────────────────────────────────
const testNotFound = async () => {
  section('404 — UNKNOWN ROUTES');

  const res = await request('GET', '/this-route-does-not-exist', null, false);
  assert('unknown route returns 404',            res.status === 404);
  assert('404 success is false',                 res.body.success === false);
};

// ══════════════════════════════════════════════════════════════════════════════
//  RUNNER
// ══════════════════════════════════════════════════════════════════════════════
const run = async () => {
  console.log(bold(cyan('\n╔══════════════════════════════════════════╗')));
  console.log(bold(cyan('║       STOCKFLOW API — TEST SUITE         ║')));
  console.log(bold(cyan('╚══════════════════════════════════════════╝')));
  console.log(yellow(`  Base URL : ${BASE_URL}`));
  console.log(yellow(`  Started  : ${new Date().toLocaleTimeString()}\n`));

  try {
    await testHealth();
    await testSignup();
    await testLogin();
    await testGetMe();
    await testCreateProduct();
    await testGetProducts();
    await testGetProductById();
    await testUpdateProduct();
    await testAdjustStock();
    await testDashboard();
    await testSettings();
    await testDeleteProduct();
    await testLogout();
    await testNotFound();
  } catch (err) {
    console.log(red(`\n[Runner Error] ${err.message}`));
    console.log(err.stack);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n' + cyan('━'.repeat(46)));
  console.log(bold('  TEST SUMMARY'));
  console.log(cyan('━'.repeat(46)));
  console.log(green(`  ✔ Passed : ${stats.passed}`));
  console.log(red(`  ✘ Failed : ${stats.failed}`));
  console.log(`  ◎ Total  : ${stats.total}`);
  console.log(cyan('━'.repeat(46)));

  if (stats.failed === 0) {
    console.log(bold(green('\n  🎉 All tests passed!\n')));
  } else {
    console.log(bold(red(`\n  ⚠ ${stats.failed} test(s) failed. Check above.\n`)));
  }

  process.exit(stats.failed > 0 ? 1 : 0);
};

run();
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const FRONTEND = 'http://localhost:5173';
const BACKEND = 'http://localhost:5000';
const API = `${BACKEND}/api`;
const OUT = path.resolve('..', 'docs', 'screenshots');

const frontendDir = path.join(OUT, 'frontend-ui');
const backendDir = path.join(OUT, 'backend-ui');
const apiDir = path.join(OUT, 'important-api-calls');
const dbDir = path.join(OUT, 'database');

const pretty = (obj) => JSON.stringify(obj, null, 2);

async function ensureDirs() {
  await fs.mkdir(frontendDir, { recursive: true });
  await fs.mkdir(backendDir, { recursive: true });
  await fs.mkdir(apiDir, { recursive: true });
  await fs.mkdir(dbDir, { recursive: true });
}

async function screenshotApiResult(page, title, requestText, responseObj, targetPath) {
  const html = `
  <html>
    <head>
      <style>
        body { font-family: Consolas, monospace; background: #0f172a; color: #e2e8f0; margin: 24px; }
        h1 { font-family: Arial, sans-serif; font-size: 22px; margin: 0 0 12px; color: #93c5fd; }
        .card { background: #111827; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-bottom: 14px; }
        .label { color: #fbbf24; font-weight: 700; margin-bottom: 8px; font-family: Arial, sans-serif; }
        pre { white-space: pre-wrap; word-break: break-word; margin: 0; font-size: 13px; line-height: 1.45; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="card">
        <div class="label">Request</div>
        <pre>${requestText.replace(/</g, '&lt;')}</pre>
      </div>
      <div class="card">
        <div class="label">Response</div>
        <pre>${pretty(responseObj).replace(/</g, '&lt;')}</pre>
      </div>
    </body>
  </html>`;
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: targetPath, fullPage: true });
}

async function run() {
  await ensureDirs();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  // Frontend UI screenshots
  await page.goto(FRONTEND, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(frontendDir, '01-home.png'), fullPage: true });

  await page.goto(`${FRONTEND}/login`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(frontendDir, '02-login.png'), fullPage: true });

  await page.fill('input[name="email"]', 'user@recipehub.com');
  await page.fill('input[name="password"]', 'user123');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('**/');
  await page.screenshot({ path: path.join(frontendDir, '03-home-after-login.png'), fullPage: true });

  const recipesRes = await fetch(`${API}/recipes`);
  const recipes = await recipesRes.json();
  const firstRecipeId = recipes?.[0]?._id;
  if (firstRecipeId) {
    await page.goto(`${FRONTEND}/recipes/${firstRecipeId}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(frontendDir, '04-recipe-detail.png'), fullPage: true });

    await page.click('button:has-text("Add to Planner")');
    await page.getByRole('button', { name: 'Add to Plan', exact: true }).click({ force: true });
    await page.waitForTimeout(1400);
  }
  await page.goto(`${FRONTEND}/planner`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(frontendDir, '05-meal-planner.png'), fullPage: true });

  // Backend UI screenshots
  await page.goto(BACKEND, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(backendDir, '01-backend-landing.png'), fullPage: true });

  await page.goto(`${API}/docs`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(backendDir, '02-swagger-ui.png'), fullPage: true });

  // Important API calls screenshots (request/response evidence)
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@recipehub.com', password: 'user123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  await screenshotApiResult(
    page,
    'API Call: POST /api/auth/login',
    `POST ${API}/auth/login\nContent-Type: application/json\n\n${pretty({ email: 'user@recipehub.com', password: 'user123' })}`,
    loginData,
    path.join(apiDir, '01-auth-login.png')
  );

  await screenshotApiResult(
    page,
    'API Call: GET /api/recipes',
    `GET ${API}/recipes`,
    recipes,
    path.join(apiDir, '02-recipes-list.png')
  );

  const plannerAddRes = await fetch(`${API}/planner/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      day: 'Tuesday',
      mealType: 'Dinner',
      recipeId: firstRecipeId,
    }),
  });
  const plannerAddData = await plannerAddRes.json();
  await screenshotApiResult(
    page,
    'API Call: POST /api/planner/add',
    `POST ${API}/planner/add\nAuthorization: Bearer <token>\nContent-Type: application/json\n\n${pretty({
      day: 'Tuesday',
      mealType: 'Dinner',
      recipeId: firstRecipeId,
    })}`,
    plannerAddData,
    path.join(apiDir, '03-planner-add.png')
  );

  const meRes = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  await screenshotApiResult(
    page,
    'API Call: GET /api/auth/me',
    `GET ${API}/auth/me\nAuthorization: Bearer <token>`,
    meData,
    path.join(apiDir, '04-auth-me.png')
  );

  // Database schema + query screenshots
  await screenshotApiResult(
    page,
    'Database Schema Summary (MongoDB)',
    'Collections: users, recipes, mealplans',
    {
      users: {
        name: 'String (required)',
        email: 'String (required, unique)',
        role: 'user|admin',
        bookmarks: 'ObjectId[] -> recipes',
      },
      recipes: {
        title: 'String (required)',
        category: 'Enum',
        author: 'ObjectId -> users',
        ratings: '[{ user: ObjectId, value: 1..5 }]',
      },
      mealplans: {
        user: 'ObjectId -> users (unique)',
        meals: '[{ day, mealType, recipe: ObjectId -> recipes }]',
      },
    },
    path.join(dbDir, '01-db-schema-summary.png')
  );

  const plannerRes = await fetch(`${API}/planner`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const plannerData = await plannerRes.json();
  await screenshotApiResult(
    page,
    'Database Query Evidence (MealPlan via API)',
    `Equivalent DB intent:\nmealplans.findOne({ user: ObjectId("${loginData._id}") })\n  .populate("meals.recipe")`,
    plannerData,
    path.join(dbDir, '02-db-query-mealplan.png')
  );

  await context.close();
  await browser.close();
  console.log(`Screenshots saved to: ${OUT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

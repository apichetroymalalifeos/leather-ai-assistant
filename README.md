# Leather AI Sales Assistant — Leather Warehouse

A local-first, static AI sales-assistant web app for **Leather Warehouse**
(genuine leather, synthetic leather, microfiber, marine-grade, and
aviation-grade leather materials). No backend, no subscriptions, no cloud
database — everything runs in the browser using `localStorage`, seeded from a
built-in demo dataset.

The badge **"Company Knowledge Only"** in the header is a reminder that every
answer the assistant gives is sourced strictly from this app's own product
database (`data/*.json` / the Knowledge Base Manager) — never invented.

---

## 1. How to open the app

This is a plain static site — three files (`index.html`, `styles.css`,
`app.js`) plus a `/data` folder of JSON files, a PWA manifest, and a service
worker. No build step, no `npm install`.

**Option A — just open it directly**
Double-click `index.html` (or open it via `File → Open` in your browser).
Everything works over `file://` except the optional "install as app" /
offline-caching behavior, which browsers only enable for pages served over
`http://` or `https://`. The app detects this automatically and skips service
worker registration when running via `file://`, so you will not see any
console errors either way.

**Option B — serve it locally (recommended, enables full PWA features)**
From this folder, run any static file server, for example:

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser. On this path you also get:
- "Add to Home Screen" / "Install app" prompts (PWA installability)
- Offline caching of the app shell via `service-worker.js`

**Mobile (iPhone/Android):** open the same `http://` URL on your phone (same
Wi-Fi network, using your computer's local IP instead of `localhost`), then
use the browser's "Add to Home Screen" option to install it like a native app.

---

## 2. What's inside (file map)

| File | Purpose |
|---|---|
| `index.html` | App shell — header, sidebar (desktop), bottom nav (mobile), and all 8 view sections. |
| `styles.css` | Premium B2B theme (black / brown / cream / soft gold), mobile-first responsive layout. |
| `app.js` | **All application logic**, in two parts inside one file: <br>• **Part 1** — data layer (`localStorage` persistence, demo data seeding) + the rule-based AI answer engine. <br>• **Part 2** — UI rendering and event wiring for every page (chat, finder, compare, image match, quote, admin, KB manager, leads). |
| `data/products.json` | Demo catalog (8 products across Genuine/Synthetic/Microfiber/Marine/Aviation/Fire-retardant/UV-resistant/Medical-grade categories) — mirrors the seeded data in `app.js`, kept here so it's easy to read/edit outside the app. |
| `data/faqs.json` | 17 demo FAQ entries with risk-level tagging. |
| `data/usecases.json` | 8 use cases (Hotel, Yacht/Marine, Aviation, Cinema, Hospital, Office, Automotive, Residential) with recommended products/criteria/objections. |
| `data/price-rules.json` | Per-product pricing rules (retail/project price, discount tier, min order, AE-confirmation flag). |
| `data/lead-times.json` | Lead-time rules by stock/condition. |
| `manifest.webmanifest` | PWA manifest (name, theme colors, icons, standalone display). |
| `service-worker.js` | Caches the app shell + data files for offline use; only registers when served over http(s). |

---

## 3. Pages / features

1. **Customer Chat** — ask a question in Thai (or English); the assistant
   replies with a structured 6-part answer: summary, recommended product(s),
   reasons, cautions, items needing AE confirmation, and a call-to-action.
   If nothing in the knowledge base matches well enough, it always falls back
   to: *"ข้อมูลนี้ต้องให้ AE ตรวจสอบเพิ่มเติมก่อน เพื่อป้องกันการให้ข้อมูลผิดพลาด"*
2. **Product Finder** — pick a use case, get recommended products with
   reasons/highlights/cautions and one-tap "Request Sample" / "Request Quote".
3. **Product Compare** — pick 2–3 products, see a full side-by-side spec table.
4. **Image Match** — upload a photo (mock matching only — there is no real
   computer-vision model in Phase 1), then choose what to compare it on
   (color / texture / properties / use case). Always shows the disclaimer:
   *"การเทียบจากรูปเป็นการประเมินเบื้องต้น สีจริงและผิวสัมผัสต้องยืนยันด้วย sample จริง"*
5. **Quote Request** — a form that saves directly into the Lead Inbox and
   confirms: *"ได้รับข้อมูลแล้ว ทีม AE จะตรวจสอบราคา stock และ lead time ก่อนยืนยันกลับ"*
6. **Admin Dashboard** — total leads, new leads today, top questions, most-
   asked products, top use cases, **Export Leads to CSV**, **Reset Demo Data**.
7. **Knowledge Base Manager** — full add/edit/delete for all 5 datasets
   (Products, FAQs, Use Cases, Price Rules, Lead Times) right from the UI.
8. **Lead Inbox** — every quote/sample request that comes in, with a
   changeable status: new → contacted → quoted → sample sent → won / lost.

---

## 4. Editing the data

There are two equivalent ways to change what the assistant knows:

**A. In the app (recommended for day-to-day use)**
Go to **Knowledge Base Manager**, pick a tab (Products / FAQs / Use Cases /
Price Rules / Lead Times), and use **+ Add new** or the **Edit/Delete**
buttons on each row. Changes save immediately to `localStorage` and the
assistant uses them on the very next question.

**B. By editing the source files (for bulk changes / version control)**
Edit the `DEMO_DATA` object near the top of `app.js`, and/or the mirrored
`data/*.json` files for reference. Note: the JSON files are **not** fetched
at runtime (to avoid `file://` CORS issues) — they exist as a readable,
diff-friendly copy of the same seed data baked into `app.js`. If you change
one, keep the other in sync, or simply use the in-app KB Manager and treat
the JSON files as documentation/export only.

**Resetting:** click **Reset Demo Data** on the Admin Dashboard to wipe all
edits and leads and restore the original demo dataset.

---

## 5. The AI's hard rules (always enforced)

- Never invents a price — if a price isn't in `price-rules.json` / the
  Price Rules tab, the answer says to confirm with an AE.
- Never confirms stock without data from the Products table.
- Never confirms lead time beyond what's in `lead-times.json` / the product's
  own lead-time fields.
- Always flags aviation, marine, and fire-retardant items as needing AE /
  certificate confirmation before being treated as final.
- Asks for more detail or hands off to an AE when it doesn't have enough
  information, rather than guessing.
- Image-based comparisons are always labeled as preliminary only.
- Keeps a professional B2B tone and steers toward a sample or quote request.

---

## 6. Roadmap

**Phase 1 (this build) — Local-first AI sales assistant**
Static, no-backend, rule-based assistant over a local knowledge base, with
full CRUD, lead capture, and an admin dashboard — everything in this repo.

**Phase 2 — Smarter answers + real CRM**
- Connect to the OpenAI API (or a self-hosted/local LLM) for more natural
  language understanding on top of the same knowledge base.
- Add semantic search over products/FAQs instead of keyword matching.
- Integrate with Zoho CRM so leads sync automatically instead of living only
  in `localStorage`.

**Phase 3 — Production scale**
- Real image-based material matching (actual computer vision, not mock).
- Live stock-level sync with the warehouse/ERP system.
- LINE Official Account integration for chat directly from LINE.
- Role-based permissions (sales rep vs. admin vs. AE).
- A full analytics dashboard (conversion rates, response times, win rates).

---

## 7. Notes for developers

- Single JS file by design: all logic (data layer, AI engine, and UI
  rendering) lives in `app.js`, split into two clearly commented IIFEs.
  There is intentionally no separate `ui.js`.
- No external dependencies, no build step, no bundler — open `index.html`
  and it works.
- All persisted state lives under a handful of `localStorage` keys (see
  `STORE_KEYS` near the top of `app.js`); clearing your browser's site data
  for this page has the same effect as "Reset Demo Data."

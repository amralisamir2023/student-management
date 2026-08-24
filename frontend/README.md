# Student Management System — Frontend

Angular app implementing the design at `claude.ai/design` project **"SMS Mockups"**
(`SMS Mockups.dc.html`). Connects to the real backend in `../backend/`.

## Running it

You need the backend running too (`cd ../backend && npm run dev`, port 5000).

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

## What's actually connected vs mocked

| Module | Status |
|---|---|
| Auth (register / login / logout) | **Real** — `core/services/auth.service.ts` |
| Students | **Real** — `core/services/student.service.ts` |
| Departments | Mocked — `core/services/department.service.ts` |
| Courses | Mocked — `core/services/course.service.ts` |
| Instructors | Mocked — `core/services/instructor.service.ts` |
| Enrollments | Mocked — `core/services/enrollment.service.ts` |

Every service — real or mocked — implements the same `CrudService<T>` interface
(`core/services/crud.service.ts`) and returns the exact same
`{ success, message, data }` envelope the real API uses. The UI (list pages,
detail pages, forms) was built entirely against that interface, so connecting
a mocked module for real later is a **one-file change**: rewrite that one
service to call `HttpClient` like `student.service.ts` does — nothing in
`shared/components/` or the module's config needs to change.

Each mocked service file has a comment at the top pointing at the real
backend route it should eventually call.

One exception worth knowing about: the Students "Add/Edit" form needs a real,
valid Department `_id` to submit (the backend enforces that relationship), so
`core/services/department-lookup.service.ts` makes one real, read-only
`GET /api/departments` call just to populate that dropdown. It is not the
Departments module's own UI — that stays mocked.

## Structure

```
src/app/
├── core/
│   ├── models/        TypeScript interfaces matching the backend's shapes
│   ├── config/        per-module config (fields, table columns, detail view)
│   ├── services/       one CRUD service per module + auth + toast
│   └── interceptors/   attaches the JWT to every request
├── shared/components/  generic list / detail / form-modal / confirm-modal
│                       / shell (sidebar + header) — used by every module
└── features/
    ├── auth/           login, register
    └── dashboard/
```

## Auth model in the UI

- Anyone can browse (read-only) without signing in — "guest" mode.
- Signed in as `role: "user"` behaves the same as guest for write actions
  (the backend only allows `role: "admin"` to add/edit/delete).
- Signed in as `role: "admin"` unlocks add/edit/delete everywhere, matching
  `protect` + `authorize('admin')` on the backend exactly.

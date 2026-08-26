# Student Management System — Frontend

Angular app implementing the design at `claude.ai/design` project **"SMS Mockups"**
(`SMS Mockups.dc.html`). Connects to the real backend in `../backend/`.

## Running it

You need the backend running too (`cd ../backend && npm run dev`, port 5000).

```bash
npm install
npm start        
```

## What's actually connected

Every module talks to the real backend, real database — nothing left mocked.

| Module | Backend routes |
|---|---|
| Auth (register / login / logout) | `core/services/auth.service.ts` → `/api/auth/*` |
| Students | `core/services/student.service.ts` → `/api/students/*` |
| Departments | `core/services/department.service.ts` → `/api/departments/*` |
| Courses | `core/services/course.service.ts` → `/api/courses/*` |
| Instructors | `core/services/instructor.service.ts` → `/api/instructors/*` |
| Enrollments | `core/services/enrollment.service.ts` → `/api/enrollments/*` |

Every service implements the same `CrudService<T>` interface
(`core/services/crud.service.ts`) and returns the exact same
`{ success, message, data }` envelope the real API uses. The UI (list pages,
detail pages, forms) is built entirely against that interface — so it never
cared whether a given module was real or mocked, which is what made
connecting the last four modules a small, mechanical change (rewrite each
service to call `HttpClient`, same as `student.service.ts`; nothing in
`shared/components/` needed to change).

Cross-module references (Course's department/instructor pickers,
Enrollment's student/course pickers) fetch live options from the relevant
real service — see `core/config/options-loader.util.ts`.

Two things worth knowing when a module's own field doesn't map 1:1 onto the
UI:
- `Enrollment`'s list view only supports filtering by `?semester=` and
  `?search=` on the backend — there's no `?status=` filter yet
  (`enrollmentController.js`), so the UI doesn't offer one either. Add it in
  `core/config/enrollments.config.ts` once the backend supports it.
- Table/select columns that reference another module (e.g. a Student's
  Department, a Course's Instructor) render the **populated object** the
  backend returns on every read (`{ _id, name, ... }`), not a raw id — and
  submit back the plain `_id` string on create/update, matching what each
  Mongoose `ref` field expects.

## Structure

```
src/app/
├── core/
│   ├── models/        TypeScript interfaces matching the backend's shapes
│   ├── config/        per-module config (fields, table columns, detail view,
│   │                   live cross-module option loaders)
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

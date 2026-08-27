import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Role-based (authorization) guard — for routes that should only be
// reachable by an admin, on top of authGuard's plain "are you logged in"
// check. Not attached to any route yet: every current page in the app is
// meant to be visible to any signed-in user (add/edit/delete buttons are
// hidden for non-admins directly in each page instead). Wire this in with
// canActivate: [authGuard, adminGuard] on a route if an admin-only page
// is ever added.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};

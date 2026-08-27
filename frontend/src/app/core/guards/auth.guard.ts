import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Blocks navigation to any route it's attached to unless the user has a
// valid token (checked via AuthService, which itself is backed by the
// token stored in localStorage — see auth.service.ts's readFromStorage()).
// Redirects to /login instead of letting the route load.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

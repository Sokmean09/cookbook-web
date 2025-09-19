'use client'
import { PropsWithChildren, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Users } from '../../../generated/prisma';

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: Users['role'][];
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();



  // Show loading while auth is initializing or redirecting
  if (currentUser === undefined || currentUser === null) {
    return <div>Loading...</div>;
  }

  // Only render children if currentUser exists and has permission
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <div>Permission denied</div>;
  }

  return <>{children}</>;
}

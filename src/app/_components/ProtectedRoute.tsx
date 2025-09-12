'use client'
import { PropsWithChildren } from 'react';
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

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  if (
    currentUser === null ||
    (allowedRoles && !allowedRoles.includes(currentUser.role))
  ) {
    return <div>Permission denied</div>;
  }

  return children;
}
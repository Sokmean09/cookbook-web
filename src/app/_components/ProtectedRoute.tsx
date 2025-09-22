import { PropsWithChildren } from 'react';
import { Users } from '../../../generated/prisma';
import { getSession } from '@/lib/session';
import PageDenied from './admin/PageDenied';

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: Users['role'][];
};

export default async function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {

  const session = await getSession()
  
  if (session === undefined || session === null) {
    return <div>Loading...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(String(session?.userRole))) {
    return <PageDenied />;
  }



  // const { currentUser } = useAuth();

  // // Show loading while auth is initializing or redirecting
  // if (currentUser === undefined || currentUser === null) {
  //   return <div>Loading...</div>;
  // }

  // // Only render children if currentUser exists and has permission
  // if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
  //   return <div>Permission denied</div>;
  // }

  return <>{children}</>;
}

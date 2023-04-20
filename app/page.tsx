import Loading from "./loading";

/**
 *  Set Home URL based on User Roles
 */
export function getHomeRoute(role: string) {
  if (role === 'u')
    return '/acl';
  else
    return '/home';
}

export default function HomePage() {
  return <Loading />
}
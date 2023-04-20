export default {
  loginEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
  userEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/private`,
  getUsuariosEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  getUsuarioEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/id`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken'
}

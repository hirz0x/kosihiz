import { isAdmin } from '../lib/auth';

export { default } from '../components/sosmedgo/AdminPage';

/* Halaman admin hanya bisa dibuka setelah login. */
export async function getServerSideProps({ req }) {
  if (!isAdmin(req)) return { redirect: { destination: '/admin-login', permanent: false } };
  return { props: {} };
}

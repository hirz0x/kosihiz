import LandingPage from '../components/sosmedgo/LandingPage';

export default LandingPage;

/* Pengguna yang masih punya sesi langsung dibawa ke dashboard. Sesi yang sudah tidak valid
 * ditangani dashboard sendiri, yang lalu mengarahkan ke halaman masuk. */
export async function getServerSideProps({ req }) {
  const punyaSesi = Boolean(req.cookies && (req.cookies.sg_user || req.cookies.sg_refresh));
  if (punyaSesi) return { redirect: { destination: '/dashboard', permanent: false } };
  return { props: {} };
}

import { userDariRequest } from '../lib/account';

export { default } from '../components/sosmedgo/DashboardPage';

export async function getServerSideProps({ req }) {
  const user = await userDariRequest(req);
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  return { props: {} };
}

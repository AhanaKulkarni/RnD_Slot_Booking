import { auth } from '@/auth';
import HomeClient from '@/components/home/HomeClient';

export default async function Home() {
  const session = await auth();

  return (
    <HomeClient />
  );
}

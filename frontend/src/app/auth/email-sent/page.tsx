import { redirect } from 'next/navigation';
import EmailSentClient from '@/components/auth/EmailSentClient';

export default async function EmailSentPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const email =
    typeof searchParams.email === 'string' ? searchParams.email : undefined;

  if (!email) {
    redirect('/auth/register');
  }

  return <EmailSentClient email={email} />;
}

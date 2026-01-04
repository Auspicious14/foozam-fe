import React from 'react';
import Head from 'next/head';
import Layout from '../../modules/layout';
import AnalyticsDashboard from '../../modules/admin/AnalyticsDashboard';
import { useAuth } from '../../modules/auth/context';
import { useRouter } from 'next/router';

const AdminAnalyticsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>Admin Analytics | Foozam</title>
      </Head>
      <AnalyticsDashboard />
    </Layout>
  );
};

export default AdminAnalyticsPage;

'use client';

import { MainLayout } from '@/components/main-layout';
import { useAuthStore } from '@/stores/use-auth-store';
import React, { useEffect } from 'react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { checkAdmin } = useAuthStore();

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);
  return <MainLayout>{children}</MainLayout>;
};
export default DashboardLayout;

import React from 'react';

type Props = {
  children: React.ReactNode;
};
const AdminLayout = ({ children }: Props) => {
  return <div className='min-h-screen bg-zinc-900 p-8'>{children}</div>;
};
export default AdminLayout;

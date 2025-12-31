type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  return <div className='min-h-screen w-full'>{children}</div>;
};
export default AuthLayout;

import { SignIn } from '@clerk/nextjs';

const SignPage = () => {
  return (
    <div className='min-h-screen w-full flex justify-center items-center mx-auto'>
      <SignIn />
    </div>
  );
};
export default SignPage;

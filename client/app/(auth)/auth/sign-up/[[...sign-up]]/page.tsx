import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className='min-h-screen w-full flex justify-center items-center mx-auto'>
      <SignUp />
    </div>
  );
};
export default SignUpPage;

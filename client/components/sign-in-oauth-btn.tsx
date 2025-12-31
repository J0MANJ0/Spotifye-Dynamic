import { useSignIn } from '@clerk/nextjs';
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';

export const SignInOauthBtn = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/auth-callback',
    });
  };
  return (
    <Button
      onClick={signInWithGoogle}
      variant={'secondary'}
      className='w-full text-white border-zinc-200 h-11'
    >
      <FcGoogle className='h-6 w-6' />
      Continue with Google
    </Button>
  );
};

"use client"
import { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { LockOpenIcon } from '@heroicons/react/24/solid';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Toaster } from 'sonner';
import ForgotPasswordModal from '@/components/authentication/ForgotPasswordModal';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [passView, setPassView] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        router.replace("/admin/dashboard");
      }
    }
  }, [status, router, session?.user?.role]);

  const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formElements = event.currentTarget.elements;
    const credentials = {
      email: formElements.email.value,
      password: formElements.password.value,
      persistent: formElements.persistent.checked,
    };

    try {
      const result = await signIn('credentials', {
        redirect: true,
        email: credentials.email,
        password: credentials.password,
        callbackUrl: '/admin/dashboard',
      
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Toaster position="top-right" richColors closeButton />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        endpoint="user/change-password/"
      />

      <Box
        sx={(theme) => ({
          width: '100%',
          height: '100dvh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
          position: 'relative',
        })}
      >
        {/* Form side */}
        <Box
          sx={(theme) => ({
            width: { xs: '100%', md: '50%' },
            transition: 'width var(--Transition-duration)',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255 255 255 / 0.9)',
            [theme.getColorSchemeSelector('dark')]: {
              backgroundColor: 'rgba(19 19 24 / 0.85)',
            },
          })}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100%',
              width: '100%',
              maxWidth: '600px',
              px: { xs: 2, sm: 4, md: 6 },
            }}
          >
            <Box
              component="header"
              sx={{
                py: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <img
                  src="/assets/logo/logo.png"
                  alt="Admin Logo"
                  className='object-contain'
                  style={{ width: '100px', height: '100px' }}
                />
                <Typography level="title-lg">Admin</Typography>
              </Box>
            </Box>
            <Box
              component="main"
              sx={{
                my: 'auto',
                py: 2,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: '500px',
                mx: 'auto',
                borderRadius: 'sm',
                '& form': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                },
                [`& .MuiFormLabel-asterisk`]: {
                  visibility: 'hidden',
                },
              }}
            >
              <Stack sx={{ gap: 4, mt: 2 }}>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <Typography
                      color="danger"
                      level="body-sm"
                      sx={{
                        mb: 2,
                        p: 1.5,
                        bgcolor: 'background.surface',
                        border: '1px solid',
                        borderColor: 'danger.outlinedBorder',
                        borderRadius: 'sm'
                      }}
                    >
                      {error}
                    </Typography>
                  )}
                  <FormControl required>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Password</FormLabel>
                    <div className='relative '>
                      <Input type={passView ? "text" : "password"} name="password" />
                      <div className='absolute right-2 top-2'>
                        {passView ?
                          <EyeIcon onClick={() => setPassView(false)} size={18} className='cursor-pointer' /> :
                          <EyeOffIcon onClick={() => setPassView(true)} size={18} className='cursor-pointer' />
                        }
                      </div>
                    </div>
                  </FormControl>
                  <Stack sx={{ gap: 4, mt: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}
                    >
                      <Checkbox size="sm" label="Remember me" name="persistent" />
                      <Link
                        level="title-sm"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setForgotPasswordOpen(true);
                        }}
                      >
                        Forgot your password?
                      </Link>
                    </Box>
                    <Button
                      type="submit"
                      fullWidth
                      loading={isLoading}
                      loadingPosition="start"
                      startDecorator={isLoading ? undefined : <LockOpenIcon />}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                © Clinzor {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Background image side */}
        <Box
          sx={(theme) => ({
            height: { xs: '30vh', md: '100%' },
            width: { xs: '100%', md: '50%' },
            position: { xs: 'relative', md: 'fixed' },
            right: 0,
            top: 0,
            order: { xs: -1, md: 2 },
            transition:
              'background-image var(--Transition-duration), height var(--Transition-duration)',
            transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
            backgroundColor: 'background.level1',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: 'url(/admin.jpg)',
          })}
        />
      </Box>
    </CssVarsProvider>
  );
}
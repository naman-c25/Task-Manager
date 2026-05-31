import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function LoginPage() {
  const { login } = useAuthMutations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => login.mutate(values);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeInUp} className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your workspace.</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <motion.div variants={fadeInUp}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Button type="submit" size="lg" className="w-full" isLoading={login.isPending}>
            Sign in
          </Button>
        </motion.div>
      </form>

      <motion.p variants={fadeInUp} className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </motion.p>
    </motion.div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema, type RegisterFormValues } from '@/lib/validations';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function RegisterPage() {
  const { register: registerMutation } = useAuthMutations();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (values: RegisterFormValues) => registerMutation.mutate(values);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeInUp} className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Start organizing your work in seconds.</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <motion.div variants={fadeInUp}>
          <Input
            label="Full name"
            autoComplete="name"
            placeholder="Jane Doe"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
        </motion.div>

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
            autoComplete="new-password"
            placeholder="••••••••"
            hint="At least 8 characters with upper, lower, and a number."
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Button type="submit" size="lg" className="w-full" isLoading={registerMutation.isPending}>
            Create account
          </Button>
        </motion.div>
      </form>

      <motion.p variants={fadeInUp} className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

type Step = 'email' | 'otp' | 'reset' | 'success';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.sendOtp(email);
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.verifyOtp(email, otp);
      toast.success('OTP verified!');
      setStep('reset');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPasswordWithOtp(email, otp, newPassword, confirmPassword);
      toast.success('Password reset successfully!');
      setStep('success');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIcon = () => {
    switch (step) {
      case 'email':
        return <Mail className="w-9 h-9 text-white" />;
      case 'otp':
        return <KeyRound className="w-9 h-9 text-white" />;
      case 'reset':
        return <Lock className="w-9 h-9 text-white" />;
      case 'success':
        return <CheckCircle className="w-9 h-9 text-white" />;
    }
  };

  const renderStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Forgot Password';
      case 'otp':
        return 'Verify OTP';
      case 'reset':
        return 'New Password';
      case 'success':
        return 'Success!';
    }
  };

  const renderStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Enter your email to receive an OTP';
      case 'otp':
        return `Enter the 6-digit code sent to ${email}`;
      case 'reset':
        return 'Create your new password';
      case 'success':
        return 'Your password has been reset successfully';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 gradient-hero">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-orange flex items-center justify-center shadow-lg">
            {renderStepIcon()}
          </div>
          <CardTitle className="text-2xl font-display">{renderStepTitle()}</CardTitle>
          <CardDescription>{renderStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
              <Link to="/login">
                <Button type="button" variant="ghost" className="w-full gap-2 mt-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Button>
              </Link>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full gap-2"
                onClick={() => setStep('email')}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Change Email
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                You can now login with your new password.
              </p>
              <Link to="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;

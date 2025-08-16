import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Verify from '../../../components/common/Verify/Verify';

const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = (searchParams.get('type') as 'email' | 'phone') || 'email';
  const target = searchParams.get('target') || 'your@email.com';

  const handleVerify = (code: string) => {
    alert(`Code entered: ${code}`);
  };

  const handleResend = () => {
    alert('Verification code resent!');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Verify
      type={type}
      target={target}
      onVerify={handleVerify}
      onResend={handleResend}
      onBack={handleBack}
    />
  );
};

export default VerifyPage;

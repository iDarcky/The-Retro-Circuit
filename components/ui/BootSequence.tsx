'use client';

import { useEffect, type FC } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence: FC<BootSequenceProps> = ({ onComplete }) => {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
};

export default BootSequence;

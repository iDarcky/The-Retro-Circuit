'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RetroStatusBar from '../ui/RetroStatusBar';
import { FinderLanding } from './FinderLanding';
import { QuizQuestion } from './QuizQuestion';
import { FinderResults } from './FinderResults';
import Button from '../ui/Button';
import { calculateWeights, ProfileType } from '../../lib/finder/scoring';

// Configuration
const QUESTIONS = [
  {
    id: 'q1',
    question: "What best describes you?",
    subtitle: "This helps us understand what you’ll care about most when we pick your top matches.",
    options: [
      { id: 'nostalgia', label: 'Nostalgia hunter', description: 'Reliving childhood classics', icon: 'Gamepad' },
      { id: 'completionist', label: 'Completionist', description: "Gotta catch 'em all", icon: 'Trophy' },
      { id: 'performance', label: 'Performance chaser', description: 'Wants the most powerful option', icon: 'Zap' },
      { id: 'onthego', label: 'On-the-go', description: 'Commuter, traveler', icon: 'Smartphone' },
      { id: 'gift', label: 'Finding the perfect gift', description: 'For someone special', icon: 'Heart' },
    ]
  },
  // Placeholders Q2-Q6
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `q${i + 2}`,
    question: `Question ${i + 2}`,
    subtitle: "_Placeholder subtitle text_",
    options: [
      { id: 'a', label: 'Option A', description: 'Description for option A', icon: 'Monitor' },
      { id: 'b', label: 'Option B', description: 'Description for option B', icon: 'Cpu' },
      { id: 'c', label: 'Option C', description: 'Description for option C', icon: 'HardDrive' },
      { id: 'd', label: 'Option D', description: 'Description for option D', icon: 'Wifi' },
    ]
  })),
  // Q7 Optional
  {
    id: 'q7',
    question: "Question 7",
    subtitle: "_Optional Question_",
    isOptional: true,
    options: [
       { id: 'a', label: 'Option A', description: 'Description for option A', icon: 'Monitor' },
       { id: 'b', label: 'Option B', description: 'Description for option B', icon: 'Cpu' },
    ]
  },
  // Q8 Bonus
  {
    id: 'q8',
    question: "Question 8",
    subtitle: "_Bonus Round_",
    isBonus: true,
    options: [
       { id: 'a', label: 'Option A', description: 'Description for option A', icon: 'Monitor' },
       { id: 'b', label: 'Option B', description: 'Description for option B', icon: 'Cpu' },
    ]
  }
];

const FinderFlowContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [designStyle, setDesignStyle] = useState<'card' | 'button'>('card');

  const stepParam = searchParams.get('step');

  // Calculate step index based on URL param
  let stepIndex = -1;
  if (stepParam === 'results') {
    stepIndex = QUESTIONS.length;
  } else if (stepParam?.startsWith('q')) {
    const qNum = parseInt(stepParam.substring(1));
    if (!isNaN(qNum) && qNum >= 1 && qNum <= QUESTIONS.length) {
      stepIndex = qNum - 1;
    }
  }

  const handleStart = () => {
    router.push('/finder?step=q1');
  };

  const handleAnswer = (optionId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Q1 Logic: Set Profile and Initial Weights
    if (stepIndex === 0) {
      params.set('profile', optionId);

      if (optionId === 'gift') {
        params.set('tone_mode', 'gift');
      } else {
        params.delete('tone_mode'); // Default
      }

      const weights = calculateWeights(optionId as ProfileType);
      console.log('Calculated Weights:', weights);
    }

    // Navigation
    if (stepIndex < QUESTIONS.length - 1) {
      params.set('step', `q${stepIndex + 2}`);
    } else {
      params.set('step', 'results');
    }

    router.push(`/finder?${params.toString()}`);
  };

  const handleRestart = () => {
    router.push('/finder');
  };

  const toggleStyle = () => {
    setDesignStyle(prev => prev === 'card' ? 'button' : 'card');
  };

  return (
    <div className="relative min-h-screen pb-12">
      {/* Dev Toggle */}
      {stepIndex >= 0 && stepIndex < QUESTIONS.length && (
        <div className="fixed bottom-4 right-4 z-50">
           <Button
            variant="secondary"
            onClick={toggleStyle}
            className="text-xs px-3 py-1 bg-black/80 backdrop-blur"
          >
            Style: {designStyle.toUpperCase()}
          </Button>
        </div>
      )}

      {/* Status Bar - Placed at top like other pages */}
      <RetroStatusBar
        docId="FINDER_V1"
        rcPath={`RC://FINDER/${stepIndex === -1 ? 'START' : stepIndex === QUESTIONS.length ? 'RESULTS' : `Q${stepIndex + 1}`}`}
      />

      <div className="container mx-auto pt-8 md:pt-16">
        {stepIndex === -1 && <FinderLanding onStart={handleStart} />}

        {stepIndex >= 0 && stepIndex < QUESTIONS.length && (
          <QuizQuestion
            question={QUESTIONS[stepIndex].question}
            subtitle={QUESTIONS[stepIndex].subtitle}
            options={QUESTIONS[stepIndex].options as any}
            onAnswer={handleAnswer}
            designStyle={designStyle}
            stepNumber={stepIndex + 1}
            totalSteps={QUESTIONS.length}
            isOptional={QUESTIONS[stepIndex].isOptional}
            isBonus={QUESTIONS[stepIndex].isBonus}
          />
        )}

        {stepIndex === QUESTIONS.length && (
          <FinderResults onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export const FinderFlow = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center font-pixel text-white">LOADING...</div>}>
      <FinderFlowContent />
    </Suspense>
  );
};

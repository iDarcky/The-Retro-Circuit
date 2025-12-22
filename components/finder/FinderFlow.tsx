'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RetroStatusBar from '../ui/RetroStatusBar';
import { FinderLanding } from './FinderLanding';
import { QuizQuestion } from './QuizQuestion';
import { FinderResults } from './FinderResults';
import Button from '../ui/Button';
import { calculateWeights, ProfileType, calculateFormFactorScore } from '../../lib/finder/scoring';

// Configuration
const QUESTIONS = [
  {
    id: 'q1',
    question: "What best describes you?",
    subtitle: "This helps us understand what you’ll care about most when we pick your top matches.",
    options: [
      { id: 'nostalgia', label: 'Nostalgia hunter', description: 'Reliving childhood classics' },
      { id: 'completionist', label: 'Completionist', description: "Gotta catch 'em all" },
      { id: 'performance', label: 'Performance chaser', description: 'Wants the most powerful option' },
      { id: 'onthego', label: 'On-the-go', description: 'Commuter, traveler' },
      { id: 'gift', label: 'Finding the perfect gift', description: 'For someone special' },
    ]
  },
  {
    id: 'q2',
    question: "Form Factor - How do you want to hold it?",
    subtitle: "This is mostly about comfort and nostalgia — we’ll prioritize your preferred shape when we can.",
    options: [
      { id: 'horizontal', label: 'Classic horizontal (like Game Boy Advance)' },
      { id: 'vertical', label: 'Vertical pocket device (like original Game Boy)' },
      { id: 'clamshell', label: 'Clamshell flip-style (like DS / GBA SP)' },
      { id: 'surprise', label: 'Surprise me' },
    ]
  },
  {
    id: 'q3',
    question: "What do you mainly want to play?",
    subtitle: "Choose the highest era you want to play comfortably. This has the biggest impact on results.",
    options: [
      { id: '8bit', label: '8-bit & 16-bit era (NES, SNES, Genesis, Game Boy, GBA)', description: 'Think: Mario, Sonic, Pokémon Red/Blue' },
      { id: '32bit', label: '32-bit & 64-bit era (PS1, N64, Dreamcast)', description: 'Think: Final Fantasy VII, GoldenEye, Crash Bandicoot' },
      { id: '2000s', label: '2000s handhelds (PSP, Nintendo DS, GBA)', description: 'Think: God of War PSP, Pokémon Diamond, Advance Wars' },
      { id: '6thgen', label: '6th gen consoles (PS2, GameCube, Xbox, Wii)', description: 'Think: GTA San Andreas, Super Smash Bros Melee' },
      { id: 'modern', label: 'Everything modern (PS3, Switch, PC games)', description: 'Think: Breath of the Wild, The Last of Us' },
    ]
  },
  // Placeholders Q4-Q6
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `q${i + 4}`,
    question: `Question ${i + 4}`,
    subtitle: "_Placeholder subtitle text_",
    options: [
      { id: 'a', label: 'Option A', description: 'Description for option A' },
      { id: 'b', label: 'Option B', description: 'Description for option B' },
      { id: 'c', label: 'Option C', description: 'Description for option C' },
      { id: 'd', label: 'Option D', description: 'Description for option D' },
    ]
  })),
  // Q7 Optional
  {
    id: 'q7',
    question: "Question 7",
    subtitle: "_Optional Question_",
    isOptional: true,
    options: [
       { id: 'a', label: 'Option A', description: 'Description for option A' },
       { id: 'b', label: 'Option B', description: 'Description for option B' },
    ]
  },
  // Q8 Bonus
  {
    id: 'q8',
    question: "Question 8",
    subtitle: "_Bonus Round_",
    isBonus: true,
    options: [
       { id: 'a', label: 'Option A', description: 'Description for option A' },
       { id: 'b', label: 'Option B', description: 'Description for option B' },
    ]
  }
];

const FinderFlowContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [designStyle, setDesignStyle] = useState<'card' | 'button'>('card');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    // Q2 Logic: Form Factor
    if (stepIndex === 1) {
        params.set('form_factor_pref', optionId);
        // Example check for logic (Bonus/Penalty logic would happen at matching time)
        console.log('Form Factor Preference:', optionId);
        // Just for verification that logic exists
        if (optionId !== 'surprise') {
            const score = calculateFormFactorScore('Horizontal', optionId); // Example check
            console.log(`Score check for 'Horizontal' vs '${optionId}':`, score);
        }
    }

    // Q3 Logic: Target Tier
    if (stepIndex === 2) {
        params.set('target_tier', optionId);
        console.log('Target Tier:', optionId);
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

  // Prevent hydration mismatch by rendering nothing until client side (or use Suspense properly)
  if (!isClient) return null;

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
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <FinderFlowContent />
    </Suspense>
  );
};

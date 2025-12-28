'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RetroStatusBar from '../ui/RetroStatusBar';
import { FinderLanding } from './FinderLanding';
import { QuizQuestion } from './QuizQuestion';
import { FinderResults } from './FinderResults';
import Button from '../ui/Button';

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
  {
    id: 'q4',
    question: "What’s your budget?",
    subtitle: "We’ll aim to stay inside your range. If your performance target needs more power, we’ll show the closest option and explain why.",
    options: [
      { id: 'b_under_60', label: 'Budget-friendly (Under $60)' },
      { id: 'b_60_120', label: 'Sweet spot ($60–$120)' },
      { id: 'b_120_180', label: 'Mid-range ($120–$180)' },
      { id: 'b_180_300', label: 'High-end ($180–$300)' },
      { id: 'b_300_plus', label: 'No budget limit ($300+)' },
    ]
  },
  // Q5: Portability
  {
    id: 'q5',
    question: "How portable do you want it to be?",
    subtitle: "We score devices based on how well they fit your portability style, rather than filtering them out.",
    options: [
      { id: 'pocket', label: 'Prefer pocket-friendly devices (Jeans pocket)' },
      { id: 'jacket', label: 'Prefer bag/jacket friendly (Some bulk is fine)' },
      { id: 'home', label: 'Prioritize comfort & screen size (Portability not important)' },
      { id: 'versatile', label: 'Balanced preference (Good mix of both)' },
    ]
  },
  // Q6: Setup
  {
    id: 'q6',
    question: "How much setup are you willing to do?",
    subtitle: "Some handhelds are plug-and-play, others need a bit of tuning. This keeps recommendations realistic.",
    options: [
      { id: 'beginner', label: 'Total beginner - want it to work out of the box' },
      { id: 'intermediate', label: 'I can follow a guide or tutorial' },
      { id: 'tinker', label: 'Happy to tinker and customize' },
      { id: 'power', label: 'Power user - give me all the options' },
    ]
  },
  // Q7: Features (Multi-select)
  {
    id: 'q7',
    question: "Any must-have features?",
    subtitle: "Optional — select only if it’s a deal-breaker. Leaving this blank gives the best recommendations.",
    isOptional: true,
    multiSelect: true,
    options: [
       { id: 'hdmi', label: 'Must have HDMI / video output' },
       { id: 'bluetooth', label: 'Must have Bluetooth (wireless audio/controllers)' },
       { id: 'wifi', label: 'Must have Wi-Fi (updates, scraping, online features)' },
       { id: 'dual_sticks', label: 'Must have dual analog sticks' },
       { id: 'dual_screen', label: 'Must support dual-screen for DS games' },
       { id: 'none', label: 'None of these matter' },
    ]
  },
  // Q8: Aesthetic (Bonus)
  {
    id: 'q8',
    question: "What look do you prefer?",
    subtitle: "We’ll try to match the vibe, but performance and budget come first.",
    isBonus: true,
    options: [
       { id: 'retro', label: 'Classic retro (grey/beige, 90s vibes)' },
       { id: 'transparent', label: 'Transparent (see-through, atomic purple, cyberpunk)' },
       { id: 'modern', label: 'Sleek & modern (black/white/metal, minimal)' },
       { id: 'colorful', label: 'Colorful & fun (bright colors, playful)' },
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

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepParam]);

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

  const handleAnswer = (answer: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // For single select questions, 'answer' is string.
    // For multi select (Q7), it is string[].
    const optionId = Array.isArray(answer) ? answer.join(',') : answer;

    // Q1 Logic: Set Profile and Initial Weights
    if (stepIndex === 0) {
      params.set('profile', optionId);

      if (optionId === 'gift') {
        params.set('tone_mode', 'gift');
      } else {
        params.delete('tone_mode'); // Default
      }
    }

    // Q2 Logic: Form Factor
    if (stepIndex === 1) {
        params.set('form_factor_pref', optionId);
    }

    // Q3 Logic: Target Tier
    if (stepIndex === 2) {
        params.set('target_tier', optionId);
        console.log('Target Tier:', optionId);
    }

    // Q4 Logic: Budget
    if (stepIndex === 3) {
        params.set('budget_band', optionId);
        console.log('Budget Band:', optionId);
    }

    // Q5 Logic: Portability
    if (stepIndex === 4) {
        params.set('portability', optionId);
        console.log('Portability:', optionId);
    }

    // Q6 Logic: Setup
    if (stepIndex === 5) {
        params.set('setup', optionId);
        console.log('Setup:', optionId);
    }

    // Q7 Logic: Features
    if (stepIndex === 6) {
        // Handle "none" logic or empty
        if (Array.isArray(answer)) {
             if (answer.includes('none')) {
                 params.set('features', 'none');
             } else if (answer.length > 0) {
                 params.set('features', answer.join(','));
             } else {
                 params.set('features', 'none'); // Fallback
             }
        } else {
             // Fallback if somehow single string passed
             params.set('features', optionId);
        }
        console.log('Features:', params.get('features'));
    }

    // Q8 Logic: Aesthetic
    if (stepIndex === 7) {
        params.set('aesthetic', optionId);
        console.log('Aesthetic:', optionId);
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

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen pb-12">
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

      <RetroStatusBar
        docId="FINDER_V1"
        rcPath={`RC://FINDER/${stepIndex === -1 ? 'START' : stepIndex === QUESTIONS.length ? 'RESULTS' : `Q${stepIndex + 1}`}`}
      />

      <div className="container mx-auto pt-8 md:pt-16">
        {stepIndex === -1 && <FinderLanding onStart={handleStart} />}

        {stepIndex >= 0 && stepIndex < QUESTIONS.length && (
          <QuizQuestion
            question={QUESTIONS[stepIndex].question}
            subtitle={
                // Dynamic Subtitle Logic for Gift Mode
                (searchParams.get('tone_mode') === 'gift')
                    ? (QUESTIONS[stepIndex].id === 'q3'
                        ? "Choose what the person you’re gifting this to would enjoy playing most."
                        : QUESTIONS[stepIndex].id === 'q6'
                            ? "For gifts, we usually recommend simpler setup unless you know they like tinkering."
                            : QUESTIONS[stepIndex].subtitle)
                    : QUESTIONS[stepIndex].subtitle
            }
            options={QUESTIONS[stepIndex].options as any}
            onAnswer={handleAnswer}
            designStyle={designStyle}
            stepNumber={stepIndex + 1}
            totalSteps={QUESTIONS.length}
            isOptional={QUESTIONS[stepIndex].isOptional}
            isBonus={QUESTIONS[stepIndex].isBonus}
            multiSelect={(QUESTIONS[stepIndex] as any).multiSelect}
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

'use client';

import { useState } from 'react';
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
    subtitle: "_This helps us understand your priorities_",
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

export const FinderFlow = () => {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = Landing, 0..N = Questions, N+1 = Results
  const [designStyle, setDesignStyle] = useState<'card' | 'button'>('card');

  const handleStart = () => setStepIndex(0);

  const handleAnswer = (_optionId: string) => {
    // In a real app, we'd store the answer here
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      setStepIndex(QUESTIONS.length); // Move to results
    }
  };

  const handleRestart = () => {
    setStepIndex(-1);
  };

  const toggleStyle = () => {
    setDesignStyle(prev => prev === 'card' ? 'button' : 'card');
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12">
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

      {/* Status Bar */}
      <RetroStatusBar
        docId="FINDER_V1"
        rcPath={`RC://FINDER/${stepIndex === -1 ? 'START' : stepIndex === QUESTIONS.length ? 'RESULTS' : `Q${stepIndex + 1}`}`}
      />

      <div className="container mx-auto">
        {stepIndex === -1 && <FinderLanding onStart={handleStart} />}

        {stepIndex >= 0 && stepIndex < QUESTIONS.length && (
          <QuizQuestion
            question={QUESTIONS[stepIndex].question}
            subtitle={QUESTIONS[stepIndex].subtitle}
            options={QUESTIONS[stepIndex].options as any} // Cast because icons are strings in config but ReactNode in types
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

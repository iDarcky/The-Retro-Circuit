'use client';

import { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
// No icon imports needed as we removed them from config

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode; // Kept as optional but will likely be undefined in config now
}

interface QuizQuestionProps {
  question: string;
  subtitle?: string;
  options: QuizOption[];
  onAnswer: (optionId: string) => void;
  designStyle: 'card' | 'button';
  stepNumber: number;
  totalSteps: number;
  isOptional?: boolean;
  isBonus?: boolean;
}

export const QuizQuestion: FC<QuizQuestionProps> = ({
  question,
  subtitle,
  options,
  onAnswer,
  designStyle,
  stepNumber,
  totalSteps,
  isOptional,
  isBonus,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 w-full animate-in slide-in-from-right duration-300">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="font-tech text-secondary text-sm tracking-wider">
            QUESTION {stepNumber} / {totalSteps}
          </span>
          {isOptional && (
            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs font-mono rounded border border-gray-700">
              OPTIONAL
            </span>
          )}
          {isBonus && (
            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-mono rounded border border-accent/40 animate-pulse">
              BONUS ROUND
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-4xl font-pixel text-white mb-2 leading-tight">
          {question}
        </h2>

        {subtitle && (
          <p className="text-gray-400 italic font-mono text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      <div className={clsx(
        "grid gap-4",
        designStyle === 'card'
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 max-w-xl mx-auto"
      )}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={clsx(
              "group relative text-left transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-bg-primary",
              designStyle === 'card'
                ? "bg-bg-secondary/50 border border-white/10 hover:border-secondary p-6 rounded-lg backdrop-blur-sm flex flex-col gap-3 h-full"
                : "bg-transparent border-2 border-white/20 hover:border-secondary hover:bg-white/5 p-4 rounded flex items-center gap-4"
            )}
          >
            {designStyle === 'card' ? (
              // CARD LAYOUT
              <>
                {/* Removed icon rendering block entirely as per request */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-secondary mb-1">
                    {option.label}
                  </h3>
                  {option.description && (
                    <p className="text-sm text-gray-400 font-mono leading-relaxed group-hover:text-gray-300">
                      {option.description}
                    </p>
                  )}
                </div>
              </>
            ) : (
              // BUTTON LAYOUT
              <>
                 {/* Removed icon rendering block entirely as per request */}
                <div className="flex-1">
                  <span className="block text-lg font-bold text-white group-hover:text-secondary">
                    {option.label}
                  </span>
                  {/* In button mode, we might hide description or keep it minimal. Let's keep it but smaller */}
                  {option.description && (
                    <span className="block text-xs text-gray-400 font-mono mt-0.5">
                      {option.description}
                    </span>
                  )}
                </div>
                {/* We can use a simple SVG chevron here or just > text if we want to remove ALL icons imports,
                    but chevron is UI navigation, not 'icon/emoji' content. Keeping it simple. */}
                <div className="opacity-0 group-hover:opacity-100 text-secondary transition-opacity">
                  <span className="font-pixel text-xl">&gt;</span>
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

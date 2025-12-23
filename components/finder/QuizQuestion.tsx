'use client';

import { FC, ReactNode, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Button from '../ui/Button';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface QuizQuestionProps {
  question: string;
  subtitle?: string;
  options: QuizOption[];
  onAnswer: (answer: string | string[]) => void;
  designStyle: 'card' | 'button';
  stepNumber: number;
  totalSteps: number;
  isOptional?: boolean;
  isBonus?: boolean;
  multiSelect?: boolean;
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
  multiSelect = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset selection when question changes (stepNumber changes)
  useEffect(() => {
    setSelectedIds([]);
  }, [stepNumber]);

  const handleOptionClick = (id: string) => {
    if (multiSelect) {
      // Check if it's the "None" option (assuming id='none')
      if (id === 'none') {
        // If selecting none, clear everything else and select none
        // If unselecting none, just remove it
        if (selectedIds.includes('none')) {
             setSelectedIds([]);
        } else {
             setSelectedIds(['none']);
        }
      } else {
        // Normal option
        // If "none" was selected, remove it
        let newSelection = selectedIds.filter(sid => sid !== 'none');

        if (newSelection.includes(id)) {
          newSelection = newSelection.filter(sid => sid !== id);
        } else {
          newSelection.push(id);
        }
        setSelectedIds(newSelection);
      }
    } else {
      // Single select: just replace
      setSelectedIds([id]);
    }
  };

  const handleNext = () => {
    if (selectedIds.length === 0) return;

    if (multiSelect) {
      onAnswer(selectedIds);
    } else {
      onAnswer(selectedIds[0]);
    }
  };

  // Enforce selection always, even for optional (User explicit request)
  const isNextDisabled = selectedIds.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 w-full animate-in slide-in-from-right duration-300 pb-24">
      <div className="mb-8 text-center">
        {isBonus ? (
            <div className="flex items-center justify-center gap-3 mb-4 animate-pulse">
                <span className="px-3 py-1 bg-accent/20 text-accent text-lg font-pixel tracking-widest border border-accent/40 rounded shadow-[0_0_15px_rgba(255,107,157,0.5)]">
                  BONUS ROUND
                </span>
            </div>
        ) : (
            <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-tech text-secondary text-sm tracking-wider">
                QUESTION {stepNumber} / {totalSteps}
            </span>
            {isOptional && (
                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs font-mono rounded border border-gray-700">
                OPTIONAL
                </span>
            )}
            </div>
        )}

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
        "grid gap-4 mb-8",
        designStyle === 'card'
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 max-w-xl mx-auto"
      )}>
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={clsx(
                "group relative text-left transition-all duration-200 focus:outline-none",
                // Base styles
                designStyle === 'card'
                    ? "p-6 rounded-lg backdrop-blur-sm flex flex-col gap-3 h-full border"
                    : "p-4 rounded flex items-center gap-4 border-2",
                // Active/Inactive styles
                isSelected
                    ? "bg-secondary/20 border-secondary ring-1 ring-secondary shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    : designStyle === 'card'
                        ? "bg-bg-secondary/50 border-white/10 hover:border-secondary hover:bg-bg-secondary/80"
                        : "bg-transparent border-white/20 hover:border-secondary hover:bg-white/5"
                )}
            >
                {designStyle === 'card' ? (
                // CARD LAYOUT
                <>
                    <div>
                    <h3 className={clsx("text-lg font-bold mb-1", isSelected ? "text-secondary" : "text-white group-hover:text-secondary")}>
                        {option.label}
                    </h3>
                    {option.description && (
                        <p className={clsx("text-sm font-mono leading-relaxed", isSelected ? "text-gray-200" : "text-gray-400 group-hover:text-gray-300")}>
                        {option.description}
                        </p>
                    )}
                    </div>
                </>
                ) : (
                // BUTTON LAYOUT
                <>
                    <div className="flex-1">
                    <span className={clsx("block text-lg font-bold", isSelected ? "text-secondary" : "text-white group-hover:text-secondary")}>
                        {option.label}
                    </span>
                    {option.description && (
                        <span className="block text-xs text-gray-400 font-mono mt-0.5">
                        {option.description}
                        </span>
                    )}
                    </div>
                    {/* Checkmark or indicator */}
                    <div className={clsx("transition-opacity", isSelected ? "opacity-100 text-secondary" : "opacity-0 group-hover:opacity-50")}>
                        <span className="font-pixel text-xl">{isSelected ? '✓' : '>'}</span>
                    </div>
                </>
                )}
            </button>
          );
        })}
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-center">
         <Button
            variant="primary"
            onClick={handleNext}
            disabled={isNextDisabled}
            className={clsx(
                "px-12 py-4 text-xl min-w-[200px] transition-all duration-200",
                isNextDisabled && "opacity-50 cursor-not-allowed grayscale"
            )}
         >
            NEXT
         </Button>
      </div>

    </div>
  );
};

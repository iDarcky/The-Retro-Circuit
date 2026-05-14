'use client';

import { FC, ReactNode, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import SwissButton from '@/components/console/swiss/SwissButton';

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
  onBack?: () => void;
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
  onBack,
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
      if (id === 'none') {
        if (selectedIds.includes('none')) {
             setSelectedIds([]);
        } else {
             setSelectedIds(['none']);
        }
      } else {
        let newSelection = selectedIds.filter(sid => sid !== 'none');
        if (newSelection.includes(id)) {
          newSelection = newSelection.filter(sid => sid !== id);
        } else {
          newSelection.push(id);
        }
        setSelectedIds(newSelection);
      }
    } else {
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

  const isNextDisabled = selectedIds.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
            {isBonus ? (
                <span className="px-2 py-1 bg-violet-500/10 text-violet-400 text-xs font-pixel tracking-widest border border-violet-500/20">
                  BONUS ROUND
                </span>
            ) : (
                <span className="font-mono text-zinc-500 text-xs tracking-wider border border-white/5 px-2 py-1">
                    0{stepNumber} / 0{totalSteps}
                </span>
            )}
            {isOptional && (
                <span className="px-2 py-1 bg-zinc-900 text-zinc-500 text-xs font-mono border border-zinc-800">
                OPTIONAL
                </span>
            )}
        </div>

        <h2 className="text-2xl md:text-4xl font-pixel text-white mb-4 leading-relaxed uppercase">
          {question}
        </h2>

        {subtitle && (
          <p className="text-zinc-400 font-mono text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Options Grid */}
      <div className={clsx(
        "grid gap-4 mb-12",
        // Adapt grid based on option count/length for better Swiss layouts
        options.length <= 4
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
      )}>
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={clsx(
                "group relative text-left transition-all duration-200 focus:outline-none p-6 border",
                // Swiss Interactive States
                isSelected
                    ? "bg-white border-white text-black"
                    : "bg-transparent border-white/10 text-zinc-400 hover:border-white hover:text-white"
                )}
            >
                {/* Selection Indicator (Radio/Checkbox Style) */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className={clsx(
                            "text-sm font-bold font-mono uppercase tracking-wide mb-2",
                            isSelected ? "text-black" : "text-white group-hover:text-white"
                        )}>
                            {option.label}
                        </h3>
                        {option.description && (
                            <p className={clsx(
                                "text-xs font-mono leading-relaxed",
                                isSelected ? "text-zinc-600" : "text-zinc-500 group-hover:text-zinc-400"
                            )}>
                                {option.description}
                            </p>
                        )}
                    </div>

                    {/* Checkbox Graphic */}
                    <div className={clsx(
                        "w-4 h-4 border flex items-center justify-center transition-colors mt-0.5",
                        isSelected ? "border-black bg-black text-white" : "border-zinc-700 group-hover:border-white"
                    )}>
                        {isSelected && <div className="w-2 h-2 bg-white" />}
                    </div>
                </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6">
         {onBack && stepNumber > 1 && (
            <button
               onClick={onBack}
               className="font-mono text-xs text-zinc-500 hover:text-white uppercase tracking-widest transition-colors py-4"
            >
               {'<- BACK'}
            </button>
         )}
         <SwissButton
            variant="primary" // This usually means Violet
            onClick={handleNext}
            disabled={isNextDisabled}
            className={clsx(
                "min-w-[200px] font-pixel text-sm py-4",
                isNextDisabled && "opacity-50 grayscale cursor-not-allowed"
            )}
         >
            {stepNumber === totalSteps ? 'REVEAL RESULTS' : 'NEXT STEP ->'}
         </SwissButton>
      </div>

    </div>
  );
};

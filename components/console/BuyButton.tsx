import SwissButton from './swiss/SwissButton';

interface BuyButtonProps {
    asin: string | null;
}

export default function BuyButton({ asin }: BuyButtonProps) {
    if (!asin) return null;

    return (
        <div className="flex flex-col gap-2 w-full">
            <a
                href={`https://www.amazon.com/dp/${asin}?tag=theretrocircu-20`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
            >
                <SwissButton variant="primary" className="w-full justify-center">
                    Buy on Amazon
                </SwissButton>
            </a>
            <p className="text-[10px] text-gray-400 text-center font-sans tracking-tight">
                As an Amazon Associate I earn from qualifying purchases.
            </p>
        </div>
    );
}

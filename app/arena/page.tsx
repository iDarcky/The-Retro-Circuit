import { redirect } from 'next/navigation';

export default async function OldArenaRedirect({ searchParams }: { searchParams: Promise<{ p1?: string; p2?: string; v1?: string; v2?: string }> }) {
    const params = await searchParams;
    // If they have old URL params, try to redirect them gracefully
    if (params.p1 && params.p2) {
        // We will just redirect to the new URL format
        redirect(`/arena/${params.p1}-vs-${params.p2}`);
    } else if (params.p1) {
        redirect(`/arena/${params.p1}-vs-select`);
    } else if (params.p2) {
        redirect(`/arena/select-vs-${params.p2}`);
    }

    // Otherwise, redirect to the empty arena which we can just make "select-vs-select"
    redirect('/arena/select-vs-select');
}

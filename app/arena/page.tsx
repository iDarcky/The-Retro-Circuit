import { redirect } from 'next/navigation';

export default async function OldArenaRedirect({ searchParams }: { searchParams: Promise<{ p1?: string; p2?: string; v1?: string; v2?: string }> }) {
    const params = await searchParams;

    // If they have old URL params, try to redirect them gracefully
    if (params.p1 && params.p2) {
        const v1Part = params.v1 && params.v1 !== 'base' ? `-${params.v1}` : '';
        const v2Part = params.v2 && params.v2 !== 'base' ? `-${params.v2}` : '';
        redirect(`/arena/${params.p1}${v1Part}-vs-${params.p2}${v2Part}`);
    } else if (params.p1) {
        const v1Part = params.v1 && params.v1 !== 'base' ? `-${params.v1}` : '';
        redirect(`/arena/${params.p1}${v1Part}-vs-select`);
    } else if (params.p2) {
        const v2Part = params.v2 && params.v2 !== 'base' ? `-${params.v2}` : '';
        redirect(`/arena/select-vs-${params.p2}${v2Part}`);
    }

    // Otherwise, redirect to the empty arena which we can just make "select-vs-select"
    redirect('/arena/select-vs-select');
}

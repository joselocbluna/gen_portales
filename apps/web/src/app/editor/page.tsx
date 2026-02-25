import { EditorLayout } from '@/components/editor/EditorLayout';
import { redirect } from 'next/navigation';

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const id = resolvedParams.id as string;

    if (!id) {
        redirect('/dashboard');
    }

    return <EditorLayout portalId={id} />;
}

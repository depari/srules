import { routing } from '@/i18n/routing';
import SubmitClient from '@/components/submit/SubmitClient';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function SubmitPage() {
    return <SubmitClient />;
}

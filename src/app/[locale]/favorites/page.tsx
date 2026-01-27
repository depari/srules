import { routing } from '@/i18n/routing';
import FavoritesClient from '@/components/favorites/FavoritesClient';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function FavoritesPage() {
    return <FavoritesClient />;
}

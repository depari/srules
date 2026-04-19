import { notFound } from "next/navigation";
import { getRuleBySlug, markdownToHtml, getAllRules } from "@/lib/rules";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import RuleDetail from "@/components/rules/RuleDetail";

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const rules = getAllRules();
    return routing.locales.flatMap((locale) =>
        rules.map((rule) => ({
            locale,
            slug: rule.slug.split('/'),
        }))
    );
}

export default async function RulePage({ params }: PageProps) {
    const { slug, locale } = await params;
    setRequestLocale(locale);

    // slug 배열을 경로로 합치기
    const slugPath = slug.join('/');
    const rule = getRuleBySlug(slugPath);

    if (!rule) {
        notFound();
    }

    const htmlContent = await markdownToHtml(rule.content);

    return (
        <RuleDetail 
            rule={rule} 
            htmlContent={htmlContent} 
            slugPath={slugPath} 
        />
    );
}

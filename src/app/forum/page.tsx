import { PostList } from "@/components/forum/post-list";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

export default async function ForumPage() {
  const lang = await getServerLanguage();
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-geul-text mb-6">{t.forum.title}</h1>
      <PostList />
    </div>
  );
}

import { getServiceBySlug, type ServiceData } from "./services";
import { getAllPosts, type BlogPost } from "./blog";

const blogToServices: Record<string, string[]> = {
  "quanto-custa-desenvolver-app-saas-2026": ["desenvolvimento-saas-mvp", "sistemas-pagamento"],
  "mvp-4-semanas-o-que-cortar-manter": ["desenvolvimento-saas-mvp", "desenvolvimento-react-next-js"],
  "nextjs-fastapi-stack-escala-1000-usuarios": ["desenvolvimento-react-next-js", "desenvolvimento-saas-mvp", "dashboards-analytics"],
  "stripe-brasil-pagamento-internacional-saas": ["sistemas-pagamento", "integracoes-api-stripe"],
  "contratar-dev-freelancer-agencia-cto-guia": ["desenvolvimento-saas-mvp", "migracao-stack-legado"],
};

export function getRelatedServicesForPost(postSlug: string): ServiceData[] {
  const slugs = blogToServices[postSlug] || [];
  return slugs.map(getServiceBySlug).filter((s): s is ServiceData => !!s);
}

export function getRelatedPostsForService(serviceSlug: string): BlogPost[] {
  const postSlugs = Object.entries(blogToServices)
    .filter(([, services]) => services.includes(serviceSlug))
    .map(([postSlug]) => postSlug);

  const allPosts = getAllPosts();
  return allPosts.filter((p) => postSlugs.includes(p.slug));
}

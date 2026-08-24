import Link from "next/link";

interface CourseCardProps {
  slug: string;
  titulo: string;
  subtitulo?: string | null;
  cargaHoraria?: string | null;
  moduleCount: number;
  lessonCount: number;
  preco?: string | null;
}

export function CourseCard({
  slug,
  titulo,
  subtitulo,
  cargaHoraria,
  moduleCount,
  lessonCount,
  preco,
}: CourseCardProps) {
  const isFree = !preco || parseFloat(preco) === 0;

  return (
    <Link
      href={`/cursos/${slug}`}
      className="glass-card no-underline group flex flex-col h-full hover:!border-brand/30 transition-colors"
    >
      {isFree && (
        <div className="inline-block self-start text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full mb-4">
          GRATUITO
        </div>
      )}

      <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
        {titulo}
      </h3>

      {subtitulo && (
        <p className="text-sm text-gray leading-relaxed mb-4 flex-1">
          {subtitulo}
        </p>
      )}

      <div className="flex items-center gap-4 pt-4 mt-auto border-t border-white/[0.06]">
        {cargaHoraria && (
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-brand/60"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-xs text-gray">{cargaHoraria}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-brand/60"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="text-xs text-gray">
            {moduleCount} {moduleCount === 1 ? "modulo" : "modulos"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-brand/60"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span className="text-xs text-gray">
            {lessonCount} {lessonCount === 1 ? "aula" : "aulas"}
          </span>
        </div>
      </div>
    </Link>
  );
}

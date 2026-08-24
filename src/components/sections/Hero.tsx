"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";

export function Hero() {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    class Particle {
      x: number;
      y: number;
      size: number;
      baseSpeedX: number;
      baseSpeedY: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.3;
        this.baseSpeedX = (Math.random() - 0.5) * 0.4;
        this.baseSpeedY = (Math.random() - 0.5) * 0.4;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.speedX = this.baseSpeedX + (dx / dist) * force * 1.5;
          this.speedY = this.baseSpeedY + (dy / dist) * force * 1.5;
        } else {
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;
        if (this.x < -10) this.x = canvas!.width + 10;
        if (this.x > canvas!.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas!.height + 10;
        if (this.y > canvas!.height + 10) this.y = -10;
      }

      draw() {
        const o = this.opacity * (0.7 + Math.sin(this.pulse) * 0.3);
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(230, 57, 70, ${o})`;
        ctx!.fill();
      }
    }

    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
    const particles = Array.from({ length: count }, () => new Particle());

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(230, 57, 70, ${0.08 * (1 - dist / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-5 md:px-8 pt-20 md:pt-[120px] pb-12 md:pb-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(230, 57, 70, 0.05) 0%, transparent 60%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      <div className="relative z-[2] max-w-[950px]">
        <div className="flex items-center justify-center gap-5 mb-6 md:mb-12 text-[0.7rem] font-bold tracking-[6px] text-brand uppercase opacity-0 animate-fade-down [animation-delay:0.3s]">
          <span className="block w-[50px] h-px bg-gradient-to-r from-transparent to-brand" />
          <span>{t("hero_eyebrow")}</span>
          <span className="block w-[50px] h-px bg-gradient-to-l from-transparent to-brand" />
        </div>

        <h1 className="font-heading text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-[0.9] uppercase tracking-[-4px] mb-6 opacity-0 animate-hero-reveal [animation-delay:0.5s]">
          <span>{t("hero_h1_1")}</span>
          <br />
          <span className="glow-text">{t("hero_h1_2")}</span>
          <br />
          <span className="white-bold">{t("hero_h1_3")}</span>
        </h1>

        <p className="text-[clamp(1.2rem,2.5vw,1.6rem)] text-gray-500 mb-9 opacity-0 animate-fade-up [animation-delay:0.9s]">
          {t("hero_sub_1")}
          <strong className="text-foreground font-bold">
            {t("hero_sub_2")}
          </strong>
        </p>

        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent mx-auto mb-9 opacity-0 animate-scale-x [animation-delay:1.1s]" />

        <p className="text-[1.05rem] text-gray-600 font-medium mb-8 md:mb-14 opacity-0 animate-fade-up [animation-delay:1.3s]">
          {t("hero_tagline_1")}
          <span className="text-brand">{t("hero_tagline_2")}</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up [animation-delay:1.5s]">
          <a
            href="/calculadora-site"
            className="cta-btn"
            data-track="hero_click_calculator"
          >
            <span>{t("hero_cta")}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="https://cal.com/daniel-anders-emx5kl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-brand transition-colors"
          >
            {t("hero_cta_secondary")}
          </a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 opacity-0 animate-fade-up [animation-delay:1.8s]">
          <span className="text-xs text-gray-800 tracking-[4px] uppercase">
            scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-brand/50 to-transparent" />
        </div>
      </div>

      <div className="terminal absolute bottom-12 right-12 hidden xl:block opacity-0 animate-fade-up [animation-delay:2s]">
        <div className="terminal-header">
          <div className="terminal-dot bg-[#ff5f57]" />
          <div className="terminal-dot bg-[#ffbd2e]" />
          <div className="terminal-dot bg-[#28ca42]" />
          <span className="text-[0.65rem] text-gray-600 ml-2">builder.ts</span>
        </div>
        <div className="terminal-body">
          <span className="t-comment">{"// Da ideia ao deploy"}</span>
          <br />
          <span className="t-keyword">const</span>{" "}
          <span className="t-var">mvp</span> ={" "}
          <span className="t-keyword">await</span>{" "}
          <span className="t-func">build</span>({"{"}
          <br />
          &nbsp;&nbsp;stack: [<span className="t-string">&quot;Next.js&quot;</span>,{" "}
          <span className="t-string">&quot;FastAPI&quot;</span>],
          <br />
          &nbsp;&nbsp;auth: <span className="t-var">true</span>,
          <br />
          &nbsp;&nbsp;payments: <span className="t-string">&quot;Stripe&quot;</span>,
          <br />
          &nbsp;&nbsp;deploy: <span className="t-string">&quot;Railway&quot;</span>,
          <br />
          {"}"});
          <br />
          <br />
          <span className="t-keyword">await</span>{" "}
          <span className="t-func">ship</span>(
          <span className="t-var">mvp</span>);
          <span className="terminal-cursor" />
        </div>
      </div>
    </section>
  );
}

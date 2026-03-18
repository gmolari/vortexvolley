import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">
              VORTEX<span className="text-primary">VOLLEY</span>
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Projeto de voleibol amador em Londrina-PR. Fundado em 2023 por três amigos,
              hoje com mais de 120 atletas. Foco na prática esportiva e integração entre equipes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#inicio" className="hover:text-foreground transition-colors">Início</Link></li>
              <li><Link href="/#sobre" className="hover:text-foreground transition-colors">Sobre</Link></li>
              <li><Link href="/#campeonatos" className="hover:text-foreground transition-colors">Campeonatos</Link></li>
              <li><Link href="/loja" className="hover:text-foreground transition-colors">Loja</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Contato</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>📍 Londrina, PR - Brasil</li>
              <li>
                <a
                  href="https://instagram.com/vortexlondrina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram: @vortexlondrina
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2023-{new Date().getFullYear()} Vortex Londrina. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

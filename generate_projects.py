import os

projects = [
    {
        "slug": "cristal-terminal",
        "title": "Cristal Terminal",
        "client": "Projeto Pessoal",
        "role": "Full Stack Developer & UI/UX Designer",
        "tech": "Next.js 15, React 19, Zustand 5, TailwindCSS",
        "year": "2026",
        "tags": ["Pessoal", "Full Stack", "Design", "Finanças"],
        "cover": "../../assets/img/projetos/cristalterminalcapa.webp",
        "desc_short": "Terminal financeiro de grau institucional. Combina modelos quantitativos de precisão e Inteligência Artificial para análise avançada de mercados de ações.",
        "desc_long": "Inspirado no Bloomberg Terminal, o Cristal Terminal foi concebido como uma plataforma de análise de mercados para finanças quantitativas de alta precisão. O projeto tira partido de Next.js 15 e React 19 para garantir reatividade extrema num ambiente de Single Page Application, vital para a visualização de gráficos e dashboards pesados.",
        "gallery": [
            "../../assets/img/projetos/cristalterminalcapa.webp"
        ],
        "next": "estudas-comigo"
    },
    {
        "slug": "estudas-comigo",
        "title": "Estudas Comigo",
        "client": "Centro de Estudos Estudas Comigo",
        "role": "Frontend Developer & Web Designer",
        "tech": "HTML5, CSS3, JavaScript ES6+, PHP",
        "year": "2025",
        "tags": ["Caso Real", "Frontend", "Design", "Educação"],
        "cover": "../../assets/img/projetos/estudascomigocapa.webp",
        "desc_short": "Website comercial para centro de estudos focado na captação de alunos e conversão. Design moderno, otimizado para mobile.",
        "desc_long": "Uma plataforma comercial totalmente renovada para atrair e converter novos alunos para o centro de estudos. O foco central do projeto foi a otimização mobile e a redução drástica do tempo de carregamento para combater a elevada taxa de rejeição do website antigo.",
        "gallery": [
            "../../assets/img/projetos/estudascomigocapa.webp"
        ],
        "next": "tec-n-cool"
    },
    {
        "slug": "tec-n-cool",
        "title": "Tec n' Cool",
        "client": "ISCAP / CEI",
        "role": "Frontend Developer",
        "tech": "HTML5, CSS3, JavaScript, APIs",
        "year": "2025",
        "tags": ["Caso Real", "Frontend", "Design", "Educação"],
        "cover": "../../assets/img/projetos/tecncoolcapa.webp",
        "desc_short": "Plataforma web educativa para o ISCAP/CEI. Cataloga mais de 250 filmes, séries e livros.",
        "desc_long": "Uma biblioteca digital interativa concebida para aproximar a investigação académica do CEI da cultura popular. A plataforma engloba centenas de obras, utilizando um sistema avançado de filtragem e pesquisa construído para um acesso intuitivo aos conteúdos temáticos.",
        "gallery": [
            "../../assets/img/projetos/tecncoolcapa.webp"
        ],
        "next": "gt-movel"
    },
    {
        "slug": "gt-movel",
        "title": "GT Móvel",
        "client": "GT Móvel (Retalho)",
        "role": "Web Designer & Frontend Engineer",
        "tech": "HTML5, CSS3, JavaScript",
        "year": "2026",
        "tags": ["Caso Real", "Frontend", "Design", "Retalho"],
        "cover": "../../assets/img/projetos/gtmovelcapa.webp",
        "desc_short": "Website institucional e catálogo digital desenvolvido para a GT Móvel, loja de mobiliário e eletrodomésticos.",
        "desc_long": "O desafio consistiu em modernizar a presença online de uma empresa com décadas de história. O resultado é um catálogo digital imersivo que destaca o mobiliário, conjugando tradição com um design clean e de navegação acessível para um público alargado.",
        "gallery": [
            "../../assets/img/projetos/gtmovelcapa.webp"
        ],
        "next": "expolive"
    },
    {
        "slug": "expolive",
        "title": "ExpoLive - Colégio de Gaia",
        "client": "Colégio de Gaia",
        "role": "Full Stack Architect",
        "tech": "PHP 8, MySQL, HTML5, CSS3, JS",
        "year": "2025",
        "tags": ["Pessoal", "Full Stack", "Design", "Eventos"],
        "cover": "../../assets/img/projetos/expolivecapa.webp",
        "desc_short": "Plataforma completa de gestão de eventos, conteúdos e comunicação. Inclui website público e painel de administração.",
        "desc_long": "Construído a partir do zero, o ExpoLive é um sistema robusto composto por duas vertentes: o front-office que serve os visitantes com as agendas e notícias do evento, e um back-office poderoso que permite à equipa a gestão total de expositores, utilizadores e conteúdos em tempo real.",
        "gallery": [
            "../../assets/img/projetos/expolivecapa.webp"
        ],
        "next": "elena-rostova"
    },
    {
        "slug": "elena-rostova",
        "title": "Creative Portfolio",
        "client": "Protótipo",
        "role": "UI/UX Interaction Engineer",
        "tech": "GSAP, Lenis Scroll, HTML, CSS",
        "year": "2026",
        "tags": ["Pessoal", "Frontend", "Design", "Portfólio"],
        "cover": "../../assets/img/projetos/creativeportfoliocapa.webp",
        "desc_short": "Protótipo interativo focado em UI/UX de alta fidelidade e micro-interações.",
        "desc_long": "Este é um projeto-laboratório focado exclusivamente na exploração e implementação de técnicas visuais de vanguarda. Animações complexas com GSAP, cursores personalizados, carregamento de shaders e transições de página seamlessly integram este protótipo que visa prémios de web design.",
        "gallery": [
            "../../assets/img/projetos/creativeportfoliocapa.webp"
        ],
        "next": "cristal-capital"
    },
    {
        "slug": "cristal-capital",
        "title": "Cristal Capital",
        "client": "Projeto PAP",
        "role": "Lead Architect & Full Stack",
        "tech": "PHP 8, MySQL, ElevenLabs AI, WebRTC",
        "year": "2026",
        "tags": ["Pessoal", "Full Stack", "Design", "Finanças"],
        "cover": "../../assets/img/projetos/cristalcapitalcapa.webp",
        "desc_short": "Website institucional de empresa e plataforma de gestão de conteúdos. Atua como a empresa-mãe da Cristal Terminal.",
        "desc_long": "Uma plataforma institucional massiva criada como Prova de Aptidão Profissional. Não é apenas uma montra de design; incorpora um assistente virtual potenciado por Inteligência Artificial (ElevenLabs) e integra ferramentas para a gestão completa de recursos humanos e recrutamento num back-office construído de raiz.",
        "gallery": [
            "../../assets/img/projetos/cristalcapitalcapa.webp"
        ],
        "next": "a-casa-do-gi"
    },
    {
        "slug": "a-casa-do-gi",
        "title": "A Casa do Gi",
        "client": "Alojamento Local (Mogadouro)",
        "role": "Full Stack Developer",
        "tech": "PHP, MySQL, IfthenPay, HTML/CSS/JS",
        "year": "2026",
        "tags": ["Caso Real", "Full Stack", "Design", "Alojamento"],
        "cover": "../../assets/img/projetos/acasadogicapa.webp",
        "desc_short": "Plataforma de reservas e e-commerce para alojamento local. Inclui gestão de disponibilidade, faturação e pagamentos online.",
        "desc_long": "Entregue a um cliente real, esta plataforma lida com toda a vertente comercial de um Alojamento Local. Desde a visualização dos quartos à marcação dinâmica de datas, integrando gateways de pagamento (IfthenPay) e emissão automática de faturas seguras e criptografadas, gerindo assim toda a pipeline financeira.",
        "gallery": [
            "../../assets/img/projetos/acasadogicapa.webp"
        ],
        "next": "cristal-terminal"
    }
]

template = """<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Projetos | Guilherme Marques</title>
    <link rel="icon" type="image/svg+xml" href="../../assets/img/logo.svg">

    <link rel="stylesheet" href="../../assets/css/fonts.css">
    <link rel="stylesheet" href="../../assets/css/variables.css">
    <link rel="stylesheet" href="../../assets/css/global.css">
    <link rel="stylesheet" href="../../assets/css/menu.css">
    <link rel="stylesheet" href="../../assets/css/animations.css">
    <link rel="stylesheet" href="../../assets/css/projetos.css">
    <link rel="stylesheet" href="../../assets/css/projeto-detalhe.css">
    <link rel="stylesheet" href="../../assets/css/page-transitions.css">
</head>

<body style="overflow-x: hidden;">
    <!-- Menu Trigger -->
    <button id="menuTrigger" class="menu-trigger" aria-label="Toggle Menu" aria-expanded="false">
        <div class="trigger-icon">
            <div class="trigger-line top"></div>
            <div class="trigger-line bottom"></div>
        </div>
    </button>

    <!-- Side Drawer Overlay -->
    <div id="drawerOverlay" class="drawer-overlay"></div>

    <!-- Side Drawer Menu -->
    <aside id="sideDrawer" class="side-drawer" role="dialog" aria-modal="true" aria-label="Menu Principal">
        <nav class="drawer-nav">
            <ul class="drawer-list">
                <li class="drawer-item"><a href="../../" class="drawer-link"><span class="item-num">01</span> INÍCIO <span class="arrow">→</span></a></li>
                <li class="drawer-item"><a href="../../sobre/" class="drawer-link"><span class="item-num">02</span> SOBRE <span class="arrow">→</span></a></li>
                <li class="drawer-item"><a href="../" class="drawer-link active"><span class="item-num">03</span> PROJETOS <span class="arrow">→</span></a></li>
                <li class="drawer-item"><a href="../../servicos/" class="drawer-link"><span class="item-num">04</span> SERVIÇOS <span class="arrow">→</span></a></li>
                <li class="drawer-item"><a href="../../contacto/" class="drawer-link"><span class="item-num">05</span> CONTACTO <span class="arrow">→</span></a></li>
            </ul>
        </nav>
    </aside>

    <!-- Page Transition Wrapper -->
    <div class="page-wrapper transition-active">

        <!-- Header Navigation -->
        <header class="main-header fade-in">
            <div class="header-container">
                <a href="../../" class="logo-link" aria-label="Página Inicial">
                    <img src="../../assets/img/logo.svg" alt="GM Logo" class="header-logo">
                </a>
                <a href="../../contacto/" class="header-btn">
                    Iniciar Projeto
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </header>

        <main id="main-content">
            <!-- Hero Section -->
            <section class="projeto-detalhe-hero stagger-container fade-up">
                <div class="container-large">
                    <div class="hero-top-nav">
                        <a href="../" class="back-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            Voltar aos Projetos
                        </a>
                    </div>
                    
                    <h1 class="detalhe-title fade-up">{title}</h1>
                    
                    <div class="detalhe-meta fade-up">
                        <div class="detalhe-tags">
                            {tags_html}
                        </div>
                        <span class="detalhe-year">{year}</span>
                    </div>

                    <div class="detalhe-cover fade-up">
                        <img src="{cover}" alt="{title} Capa Principal" class="lightbox-trigger zoomable-cover">
                        <div class="zoom-hint">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            <span>Clique para Ampliar</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Overview Section -->
            <section class="projeto-overview section stagger-container fade-up">
                <div class="container-large">
                    <div class="overview-grid">
                        <div class="overview-left fade-up">
                            <h2 class="overview-title">O Desafio</h2>
                            <p class="overview-desc">{desc_long}</p>
                            <p class="overview-desc">Mais informações detalhadas sobre a execução, arquitetura e resultados serão adicionadas futuramente neste espaço.</p>
                        </div>
                        <div class="overview-right fade-up">
                            <div class="info-block">
                                <h3>Cliente</h3>
                                <p>{client}</p>
                            </div>
                            <div class="info-block">
                                <h3>Papel (Role)</h3>
                                <p>{role}</p>
                            </div>
                            <div class="info-block">
                                <h3>Tecnologias</h3>
                                <p>{tech}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Gallery Section -->
            <section class="projeto-gallery section stagger-container fade-up">
                <div class="container-large">
                    <h2 class="section-title-editorial fade-up" style="margin-bottom: 2rem;">Galeria do Projeto</h2>
                    <div class="gallery-grid fade-up">
                        {gallery_html}
                    </div>
                </div>
            </section>

            <!-- Next Project CTA -->
            <section class="next-project-section fade-up">
                <a href="../{next}/" class="next-project-link">
                    <div class="container-large">
                        <span class="next-eyebrow">Próximo Projeto</span>
                        <h2 class="next-title">Explorar Mais Projetos <span class="arrow">→</span></h2>
                    </div>
                </a>
            </section>
        </main>
    </div>

    <!-- Lightbox Modal -->
    <div id="lightboxModal" class="lightbox-modal">
        <button class="lightbox-close" aria-label="Fechar Zoom">&times;</button>
        <div class="lightbox-content">
            <img id="lightboxImage" src="" alt="Imagem Ampliada">
        </div>
    </div>

    <script src="../../assets/js/main.js"></script>
    <script src="../../assets/js/page-transitions.js"></script>
    <script src="../../assets/js/lightbox.js"></script>
</body>
</html>
"""

def generate():
    base_dir = "projetos"
    for proj in projects:
        slug = proj["slug"]
        proj_dir = os.path.join(base_dir, slug)
        os.makedirs(proj_dir, exist_ok=True)
        
        tags_html = "\\n                            ".join([f'<span class="detalhe-tag">{tag}</span>' for tag in proj["tags"]])
        
        # for now, use the cover image a few times as placeholder gallery
        gallery_html = ""
        for i in range(3):
            gallery_html += f'''
                        <div class="gallery-item">
                            <img src="{proj["cover"]}" alt="Mockup {i+1}" class="lightbox-trigger">
                        </div>'''
        
        html_content = template.format(
            title=proj["title"],
            client=proj["client"],
            role=proj["role"],
            tech=proj["tech"],
            year=proj["year"],
            tags_html=tags_html,
            cover=proj["cover"],
            desc_short=proj["desc_short"],
            desc_long=proj["desc_long"],
            gallery_html=gallery_html,
            next=proj["next"]
        )
        
        file_path = os.path.join(proj_dir, "index.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Created {file_path}")

if __name__ == "__main__":
    generate()

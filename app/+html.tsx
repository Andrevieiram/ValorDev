import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Google Fonts: Inter & JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: webStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const webStyles = `
html, body { margin: 0; padding: 0; height: 100%; }
#root { display: flex; flex: 1; height: 100%; }

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-y: auto;
  overscroll-behavior-y: none;
  background-color: #ffffff;
  color: #0f172a;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark body, body.dark, html.dark body {
  background-color: #04060a;
  color: #f8fafc;
}

/* Scrollbar — AURA & NOVA */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover { background: #2563eb; }

/* Selection */
::selection {
  background-color: rgba(37, 99, 235, 0.2);
  color: inherit;
}

/* Focus ring for inputs */
input:focus, select:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  border-color: #2563eb !important;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
`;

import fs from 'fs';
import path from 'path';

interface Component {
  type: string;
  props: any;
  id: number;
  layout?: {
    width?: number;
    padding?: number;
    newRow?: boolean;
  };
}

interface Site {
  id: number;
  name: string;
  layout: Component[];
}

export class BuildService {
  private static generateHtml(site: Site): string {
    const components = site.layout.map(component => {
      const layoutStyles = component.layout ? `
        width: ${component.layout.width ? `${component.layout.width}%` : '100%'};
        padding: ${component.layout.padding || 16}px;
        ${component.layout.newRow ? 'clear: both;' : ''}
        float: left;
        box-sizing: border-box;
      ` : '';

      switch (component.type) {
        case 'header':
          return `
            <div style="${layoutStyles}">
              <header style="
                background-color: ${component.props.backgroundColor};
                text-align: ${component.props.alignment};
                color: ${component.props.textColor};
                padding: 48px 24px;
              ">
                <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">
                  ${component.props.title}
                </h1>
                <h2 style="font-size: 1.5rem; font-weight: normal;">
                  ${component.props.subtitle}
                </h2>
              </header>
            </div>
          `;

        case 'text':
          return `
            <div style="${layoutStyles}">
              <div style="
                text-align: ${component.props.alignment};
                color: ${component.props.color};
                font-size: ${component.props.fontSize};
                padding: 24px;
              ">
                ${component.props.content.split('\n').map(line => `<p>${line}</p>`).join('')}
              </div>
            </div>
          `;

        case 'image':
          return `
            <div style="${layoutStyles}">
              <div style="text-align: center; padding: 24px;">
                <img
                  src="${component.props.src}"
                  alt="${component.props.alt}"
                  style="
                    width: ${component.props.width};
                    height: ${component.props.height};
                    max-width: 100%;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  "
                />
              </div>
            </div>
          `;

        case 'button':
          return `
            <div style="text-align: center; padding: 24px;">
              <a
                href="${component.props.url}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: var(--${component.props.color});
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: 500;
                  transition: opacity 0.2s;
                "
                onmouseover="this.style.opacity = 0.8"
                onmouseout="this.style.opacity = 1"
              >
                ${component.props.text}
              </a>
            </div>
          `;

        case 'gallery':
          return `
            <div style="padding: 24px;">
              <div style="
                display: grid;
                grid-template-columns: repeat(${component.props.columns}, 1fr);
                gap: ${component.props.gap};
              ">
                ${component.props.images.map((image: any) => `
                  <div>
                    <img
                      src="${image.src}"
                      alt="${image.alt}"
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      "
                    />
                  </div>
                `).join('')}
              </div>
            </div>
          `;

        case 'contact':
          return `
            <div style="padding: 24px;">
              <form
                id="contact-form-${component.id}"
                style="
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 24px;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                "
                onsubmit="event.preventDefault(); handleSubmit(event, '${component.props.successMessage}')"
              >
                ${component.props.fields.includes('name') ? `
                  <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px;">Nome</label>
                    <input
                      type="text"
                      name="name"
                      required
                      style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                      "
                    />
                  </div>
                ` : ''}

                ${component.props.fields.includes('email') ? `
                  <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px;">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      required
                      style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                      "
                    />
                  </div>
                ` : ''}

                ${component.props.fields.includes('message') ? `
                  <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px;">Mensagem</label>
                    <textarea
                      name="message"
                      required
                      rows="4"
                      style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        resize: vertical;
                      "
                    ></textarea>
                  </div>
                ` : ''}

                <button
                  type="submit"
                  style="
                    width: 100%;
                    padding: 12px;
                    background-color: var(--${component.props.submitButtonColor});
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: opacity 0.2s;
                  "
                  onmouseover="this.style.opacity = 0.8"
                  onmouseout="this.style.opacity = 1"
                >
                  ${component.props.submitText}
                </button>
              </form>
            </div>
          `;

        default:
          return '';
      }
    }).join('\n');

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${site.name}</title>
        <style>
          :root {
            --primary: #1976D2;
            --secondary: #424242;
            --success: #4CAF50;
            --info: #2196F3;
            --warning: #FFC107;
            --error: #FF5252;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.5;
            color: #333;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          p {
            margin-bottom: 1em;
          }

          p:last-child {
            margin-bottom: 0;
          }
        </style>
        <script>
          function handleSubmit(event, successMessage) {
            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // TODO: Implementar envio do formulário
            console.log('Dados do formulário:', data);

            alert(successMessage);
            form.reset();
          }
        </script>
      </head>
      <body>
        ${components}
      </body>
      </html>
    `;
  }

  public static async buildSite(site: Site): Promise<string> {
    const html = this.generateHtml(site);
    const buildDir = path.join(__dirname, '../../builds');
    const siteBuildDir = path.join(buildDir, `${site.id}-${Date.now()}`);

    // Cria os diretórios se não existirem
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(siteBuildDir);

    // Salva o arquivo HTML
    const htmlPath = path.join(siteBuildDir, 'index.html');
    fs.writeFileSync(htmlPath, html);

    return siteBuildDir;
  }
} 
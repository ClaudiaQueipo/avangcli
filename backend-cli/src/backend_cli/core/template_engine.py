from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape


class TemplateEngine:
    def __init__(self, templates_dir: Path | None = None):
        if templates_dir is None:
            templates_dir = Path(__file__).parent.parent / "templates"

        self._templates_dir = templates_dir
        self._env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            autoescape=select_autoescape(["html", "xml"]),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    @property
    def templates_dir(self) -> Path:
        return self._templates_dir

    def render(self, template_path: str, context: dict) -> str:
        template = self._env.get_template(template_path)
        return template.render(**context)

    def render_to_file(self, template_path: str, output_path: Path, context: dict) -> None:
        content = self.render(template_path, context)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(content)

    def copy_template(self, template_path: str, output_path: Path) -> None:
        source_path = self._templates_dir / template_path
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(source_path.read_text())

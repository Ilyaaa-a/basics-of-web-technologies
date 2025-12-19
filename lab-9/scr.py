import os

# Настройки
PROJECT_DIR = "lab-9/"  # Путь к корню вашего проекта (по умолчанию — текущая папка)
OUTPUT_FILE = "project_code.txt"
CODE_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.htm', '.css', '.scss', '.sass',
    '.php', '.json', '.xml', '.yml', '.yaml', '.toml', '.ini', '.md', '.txt',
    '.sql', '.sh', '.bash', '.env', '.gitignore', '.dockerfile', '.cfg', '.conf'
}

def should_include_file(filename: str) -> bool:
    """Определяет, стоит ли включать файл по расширению или имени."""
    _, ext = os.path.splitext(filename)
    return ext.lower() in CODE_EXTENSIONS or filename in {'.gitignore', 'Dockerfile'}

def is_text_file(filepath: str) -> bool:
    """Проверяет, является ли файл текстовым (чтобы избежать бинарников)."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            f.read(1024)
        return True
    except (UnicodeDecodeError, OSError):
        return False

def collect_code_files(root_dir: str):
    """Рекурсивно собирает пути ко всем подходящим файлам."""
    code_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Пропускаем скрытые папки (например, .git, .venv и т.п.)
        dirnames[:] = [d for d in dirnames if not d.startswith('.')]
        for file in filenames:
            if should_include_file(file):
                full_path = os.path.join(dirpath, file)
                if is_text_file(full_path):
                    code_files.append(full_path)
    return sorted(code_files)

def write_to_output_file(file_list, output_path):
    """Записывает содержимое файлов в один TXT-файл с заголовками."""
    with open(output_path, 'w', encoding='utf-8') as out:
        out.write("=== Сборка кода проекта ===\n\n")
        for filepath in file_list:
            # Относительный путь для удобства
            rel_path = os.path.relpath(filepath, PROJECT_DIR)
            out.write(f"{'='*60}\n")
            out.write(f"Файл: {rel_path}\n")
            out.write(f"{'='*60}\n\n")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                out.write(content)
            except Exception as e:
                out.write(f"[Ошибка при чтении файла: {e}]\n")
            out.write("\n\n")

if __name__ == "__main__":
    print("Сборка файлов проекта...")
    files = collect_code_files(PROJECT_DIR)
    print(f"Найдено {len(files)} файлов для включения.")
    write_to_output_file(files, OUTPUT_FILE)
    print(f"Результат сохранён в: {os.path.abspath(OUTPUT_FILE)}")
import sys
from pathlib import Path

try:
    from rembg import remove
except ImportError as exc:
    raise RuntimeError(
        'rembg backend not available. Install with `pip install "rembg[cpu]"` or `pip install "rembg[gpu]"`.'
    ) from exc


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit('Usage: python remove_bg.py <input_path> <output_path>')

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not input_path.exists():
        raise FileNotFoundError(f'Input file not found: {input_path}')

    input_data = input_path.read_bytes()
    output_data = remove(input_data)
    output_path.write_bytes(output_data)


if __name__ == '__main__':
    main()

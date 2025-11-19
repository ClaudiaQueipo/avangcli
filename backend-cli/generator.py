import argparse

__version__ = "0.1.0"


def main():
    parser = argparse.ArgumentParser(description="Avang CLI Tool")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Subcomand 'hello'
    hello_parser = subparsers.add_parser("hello", help="Greet someone")
    hello_parser.add_argument("--name", default="World", help="Name to greet")

    # Subcomand 'version'
    subparsers.add_parser("version", help="Show version information")
    args = parser.parse_args()

    if args.command == "hello":
        print(f"Hello, {args.name}!")
    elif args.command == "version":
        print(f"Avang CLI v{__version__}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()

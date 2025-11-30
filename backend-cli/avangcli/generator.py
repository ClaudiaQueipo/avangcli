import argparse

__version__ = "0.1.0"

from avangcli.src.scaffolding.general.service import create_project


def main():
    parser = argparse.ArgumentParser(description="Avang CLI Tool")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Subcomand 'hello'
    hello_parser = subparsers.add_parser("hello", help="Greet someone")
    hello_parser.add_argument("--name", default="World", help="Name to greet")

    # Subcomand 'version'
    subparsers.add_parser("version", help="Show version information")

    scaffolding_parser = subparsers.add_parser("create_project", help="Create scaffolding of a new project")
    scaffolding_parser.add_argument("--name", required=True)

    args = parser.parse_args()

    if args.command == "hello":
        print(f"Hello, {args.name}!")
    elif args.command == "version":
        print(f"Avang CLI v{__version__}")
    elif args.command == "create_project":
        print("Creating scaffolding...")
        create_project(args.name)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()

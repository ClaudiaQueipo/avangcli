from setuptools import setup, find_packages

setup(
    name="avangcli",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
    ],
    entry_points={
        "console_scripts": [
            "av=avangcli.generator:main",
        ],
    },
    author="Pedro Infante",
    description="CLI customized",
    keywords="cli avang",
    python_requires="<3.12",
)
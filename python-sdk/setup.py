from setuptools import setup, find_packages

setup(
    name='lovart-sdk',
    version='1.0.0',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=['requests>=2.31'],
    extras_require={
        'dev': ['pytest', 'pytest-cov', 'mypy', 'flake8']
    }
)

#!C:\xampp\htdocs\xampp\annotaria\python\venv\Scripts\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'rdfextras==0.4','console_scripts','rdf2dot'
__requires__ = 'rdfextras==0.4'
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.exit(
        load_entry_point('rdfextras==0.4', 'console_scripts', 'rdf2dot')()
    )

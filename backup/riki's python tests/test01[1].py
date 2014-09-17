import rdflib
from SPARQLWrapper import SPARQLWrapper

#current_path = "Il path del file contente i dati"
#triplestore = rdflib.ConjunctiveGraph('SPARQLUpdateStore')
#triplestore.open((triplestore_url + "/query", triplestore_url + "/update"))
#current_graph.load(current_path,format="turtle")
#to_insert = "INSERT { %s } WHERE {}" % current_graph.serialize(format="nt")
#triplestore.update(to_insert)



current_path = "rdfStore.rdf"
triplestore_url = "http://localhost:3030/april"

triplestore = rdflib.ConjunctiveGraph('SPARQLUpdateStore')
triplestore.open((triplestore_url + "/query", triplestore_url + "/update"))

current_graph = rdflib.Graph()
current_graph.load(current_path,format="turtle")
to_insert = "INSERT { %s } WHERE {}" % current_graph.serialize(format="nt")
triplestore.update(to_insert)



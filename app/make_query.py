from SPARQLWrapper import SPARQLWrapper
import json
import collections

# returns dictionary of first 20 results (ascending order by label/title)
# key: label/title, value: uri
def dbpedia_query(search_term):
	sparql = SPARQLWrapper("http://dbpedia.org/sparql/query", returnFormat="json")
	sparql.setQuery("""
	PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>

	SELECT ?a ?b WHERE {
 		?a rdfs:label ?b .
 		filter regex(?b, \""""+ search_term + """\", \"i")
	} order by ?b
	limit 100""")

	n = json.dumps(sparql.query().convert())
	m = json.loads(n)
	results = m['results']['bindings']

	rlist = []
	for i, r in enumerate(results):
		rlist.append({"label":r['b']['value'], "uri":r['a']['value']})
	return rlist

def disease_query():
	return [{"disease":"to do", "uri":"myuri"}]

def subject_query():
	return [{"subject":"to do: combine all xml?", "uri":"uriuri.com"}]

# add all necessary prefixes to query
def set_prefix():
	# change ao:/aop: to our annotaria url
	prefixes = "PREFIX  ao: <http://ltw1404.web.cs.unibo.it/AnnOtaria/>\n"
	prefixes += "PREFIX  aop: <http://ltw1404.web.cs.unibo.it/AnnOtaria/person/>\n"
	prefixes += "PREFIX  aopub: <http://ltw1404.web.cs.unibo.it/AnnOtaria/publisher/>\n"
	prefixes += "PREFIX  aoplace: <http://ltw1404.web.cs.unibo.it/AnnOtaria/place/>\n"
	prefixes += "PREFIX  dcterms: <http://purl.org/dc/terms/>\n"
	prefixes += "PREFIX  fabio: <http://purl.org/spar/fabio/>\n"
	prefixes += "PREFIX  foaf: <http://xmlns.com/foaf/0.1/>\n"
	prefixes += "PREFIX  frbr: <http://purl.org/vocab/frbr/core#>\n"
	prefixes += "PREFIX  oa: <http://www.w3.org/ns/oa#>\n"
	prefixes += "PREFIX  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
	prefixes += "PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"
	prefixes += "PREFIX  schema: <http://schema.org/>\n"
	prefixes += "PREFIX  sem: <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#>\n"
	prefixes += "PREFIX  xml: <http://www.w3.org/XML/1998/namespace>\n"
	prefixes += "PREFIX  xsd: <http://www.w3.org/2001/XMLSchema#>\n"
	prefixes += "PREFIX  cito: <http://www.purl.org/spar/cito/>\n"
	prefixes += "PREFIX  cnt: <http://www.w3.org/2011/content#>\n"
	prefixes += "PREFIX  dbpedia-owl: <http://dbpedia.org/ontology/>\n"
	return prefixes

def set_aop():
	return """PREFIX  aop: <http://ltw1404.web.cs.unibo.it/AnnOtaria/person/>
	PREFIX  foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX  schema: <http://schema.org/>"""

def set_aopub():
	return """PREFIX  aopub: <http://ltw1404.web.cs.unibo.it/AnnOtaria/publisher/>
	PREFIX  foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX  dbpedia-owl: <http://dbpedia.org/ontology/>"""

def set_aoplace():
	return "PREFIX  aoplace: <http://ltw1404.web.cs.unibo.it/AnnOtaria/place/>\n"


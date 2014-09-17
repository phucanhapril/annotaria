# -*- coding: utf-8 -*-
# convert a query json To Turtle

import json
from pprint import pprint
import rdfextras
import rdflib_sparqlstore
import rdflib_sparql
import rdflib
from SPARQLWrapper import SPARQLWrapper


#[{
#"id":"span-651",
#"node":"s393v6764",
#"pos":0,
#"start":0,
#"end":7,
#"source":"docs\/Ann_Med_2012_Sep_3_44(6)_616-626.html",
#"type":"hasClarityScore",
#"label":"Clarity Score",
#"value":"fair",
#"name":"april",
#"email":"email",
#"time":"2014-05-27T17:21"}]

#open the json
json_data=open('a.json')
data = json.load(json_data)
json_data.close()
spam = """

	PREFIX  ao: <http://vitali.web.cs.unibo.it/AnnOtaria/>
	PREFIX  aop: <http://vitali.web.cs.unibo.it/AnnOtaria/person/> 
	PREFIX  dcterms: <http://purl.org/dc/terms/>
	PREFIX  fabio: <http://purl.org/spar/fabio/>
	PREFIX  foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX  frbr: <http://purl.org/vocab/frbr/core#>
	PREFIX  oa: <http://www.w3.org/ns/oa#>
	PREFIX  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX  schema: <http://schema.org/>
	PREFIX  sem: <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#>
	PREFIX  xml: <http://www.w3.org/XML/1998/namespace>
	PREFIX  xsd: <http://www.w3.org/2001/XMLSchema#>

INSERT DATA{[] a oa:Annotation ;
    rdfs:label \"""" + str(data[0]["label"]) + """\" ;
    oa:annotatedAt \"""" + str(data[0]["time"]) + """\" ;
    oa:annotatedBy aop:""" + data[0]["name"] + """ ;
    oa:hasBody [ a rdf:Statement ;
            rdf:object \"""" + str(data[0]["value"]) + """\";
            rdf:predicate dcterms:creator ;
            rdf:subject \"""" + str(data[0]["source"]) + """\"] ;
    oa:hasTarget [ a oa:SpecificResource ;
            oa:hasSelector [ a oa:FragmentSelector ;
                    rdf:value \"""" + str(data[0]["id"])  + """\" ;
                    oa:start \"""" + str(data[0]["start"]) + """\"^^xsd:nonNegativeIntegeroa ;
                    oa:end \"""" + str(data[0]["end"]) + """\"^^xsd:nonNegativeInteger ] ;
            oa:hasSource \"""" + str(data[0]["source"]) + """\" ] . }"""
print spam


sparql = SPARQLWrapper("http://localhost:3030/april/update")
sparql.setQuery(spam)
sparql.method = 'POST'
print sparql.query().convert()


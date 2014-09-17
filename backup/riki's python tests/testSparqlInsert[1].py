# -*- coding: utf-8 -*-
import rdfextras
import rdflib_sparqlstore
import rdflib_sparql
import rdflib
from SPARQLWrapper import SPARQLWrapper

sparql = SPARQLWrapper("http://localhost:3030/april/update")

sparql.setQuery("""
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
INSERT DATA{
[] a oa:Annotation; 
    rdfs:label "Title2";
    oa:annotatedAt "2014-05-21T18:00";
    oa:annotatedBy aop:fabio-vitali;
    oa:hasBody [ a rdf:Statement;
            rdf:predicate fabio:hasTitle;
            rdf:subject ao:BMC_Ophthalmol_2013_Mar_28_13_9_ver1];
    oa:hasTarget ao:BMC_Ophthalmol_2013_Mar_28_13_9.html . 
}""")
sparql.method = 'POST'
print sparql.query().convert()


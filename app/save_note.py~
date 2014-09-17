# -*- coding: utf-8 -*-

from flask import jsonify
import json
import rdfextras
import rdflib_sparqlstore
import rdflib_sparql
import rdflib

# returns turtle converted from json
def to_turtle(json_obj):
	#create annotator
	converted = create_annotator(json_obj['name'], json_obj['email'])

	# set type/label, author name, time
	converted += '[] a oa:Annotation ;\n'  
	converted += get_basics(json_obj)

	converted += get_body(json_obj)

	# target fragment vs entire doc
	t = json_obj['noteType']
	if t!='hasAuthor' and t!='hasPublisher' and t!='hasPublicationYear' and t!='hasTitle' and t!='hasAbstract' and t!='hasShortTitle' and t!='hasArticleComment':
		converted += get_frag_target(json_obj)

	else:
		converted += '\toa:hasTarget ao:' + json_obj['source'] + ' .\n'

	return converted

# create annotator (URL re-write when user enters annotator mode maybe?) 
def create_annotator(name, email):
	new_name = name.replace(' ', '-')
	note_taker = 'aop:' + new_name + '\n\tschema:email "' + email + '" ;\n'
	note_taker += '\tfoaf:name "' + name + '" .\n\n'
	return note_taker

# set type/label, author name, time
def get_basics(json_obj):
	my_type = json_obj['noteType']
	if my_type=='hasDbpedia':
		mytype = 'relatesTo'
	elif my_type=='hasCitation':
		my_type = 'cites'
	basics = '\trdfs:label "' + my_type + '" ;\n'
	basics += '\toa:annotatedAt "' + json_obj['time'] + '" ;\n'
	basics += '\toa:annotatedBy aop:' + json_obj['name'].replace(' ', '-') + ' ;\n'
	return basics

def get_body(json_obj):
	body = ''
	t = json_obj['noteType']
	# instance
	if t=='hasAuthor' or t=='hasPublisher' or t[:7]=='denotes' or t=='hasSubject' or t=='hasDbpedia':
		body += '\toa:hasBody <' + json_obj['bodyResource'] + '> ;\n'

	# citation	
	elif t=='hasCitation':
		body += '\toa:hasBody [ a rdf:Statement ;\n'
		body += '\t\trdf:subject ao:' + json_obj['source'] + ' ;\n'
		body += '\t\trdf:predicate cito:cites ;\n'
		body += '\t\trdf:object <' + json_obj['bodyResource'] + '> ] ;\n'

	# publication year (date)
	elif t=='hasPublicationYear':
		body += '\toa:hasBody [ a rdf:Statement ;\n'
		body += '\t\trdf:subject ao:' + json_obj['source'] + ' ;\n'
		body += '\t\trdf:predicate fabio:hasPublicationYear ;\n'
		body += '\t\trdf:object "' + json_obj['bodyLabel'] + '"^^xsd:gYear ] ;\n'

	# value (text or choice)
	else:
		body += '\toa:hasBody [ a cnt:ContentAsText ;\n\t\tcnt:chars "' + json_obj['bodyLabel'] + '"^^xsd:string ] ;\n'
	
	return body

def get_frag_target(json_obj):
	frag = '\toa:hasTarget [ a oa:SpecificResource ;\n'
	frag += '\t\toa:hasSelector [ a oa:FragmentSelector ;\n'
	frag += '\t\t\trdf:value "' + json_obj['node'] + '" ;\n'
	frag += '\t\t\toa:start "' + str(json_obj['start']) + '"^^xsd:nonNegativeInteger ;\n'
	frag += '\t\t\toa:end "' + str(json_obj['end']) + '"^^xsd:nonNegativeInteger ] ;\n'
	frag += '\t\toa:hasSource ao:' + json_obj['source']  + ' ] .\n'
	return frag

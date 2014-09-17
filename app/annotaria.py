from flask import Flask, render_template, request, jsonify
import json
import rdflib
from SPARQLWrapper import SPARQLWrapper
from prefixes import set_prefix, set_aop, set_aopub, set_aoplace
from save_note import to_turtle
from get_note import create_sparql_query, note_convert
from create_uri import send_people, send_places, send_publishers, create_author, create_publisher, create_person, create_place
from make_query import dbpedia_query, disease_query, subject_query

app = Flask(__name__, static_url_path='')
triplestore_url = "http://localhost:3030/ds"

@app.route('/')
def home():
	return render_template('app.html')
######################################

@app.route('/get_notes')
def get_note():
	# get article URI and get notes from Fuseki
	doc_uri = request.args.get('doc')

	# make query to Fuseki and convert notes to JSON
	my_query = create_sparql_query(doc_uri)
	
	sparql = SPARQLWrapper(triplestore_url + "/query",returnFormat="json")
	
	sparql.setQuery(my_query) 
	sparql_reply = sparql.query().convert()
	
	# convert sparql reply to json
	json_notes = note_convert(sparql_reply)

	return jsonify(result=json_notes)

@app.route('/save_notes')
def save_note():
	# convert string to list of json objects
	json_data = json.loads(request.args.get('data'))

	# iterate through list, converting and adding notes to turtle array
	turtle_data = []
	for i, json_obj in enumerate(json_data):
		turtle_data.append(to_turtle(json_obj))
	
	# add each turtle note to the string that will be sent to Fuseki
	# use array because python passes strings by value, making additions inefficient
	turtle_file = ''
	for turtle_obj in turtle_data:
		turtle_file += "\n"
		turtle_file += turtle_obj
	
	# add prefixes then send all notes to Fuseki
	insert_me = set_prefix()
	insert_me += "\n INSERT { %s } WHERE {}" %turtle_file
	sparql = SPARQLWrapper(triplestore_url + "/update")
	
	sparql.setQuery(insert_me) 
	sparql.method = 'POST'
	sparql.query()

	return jsonify(result="success")
####################################

@app.route('/dbpedia')
def dbpedia():
	search_term = request.args.get('search-term')
	return jsonify(result=dbpedia_query(search_term))
#####################################################

@app.route('/get_diseases')
def get_diseases():
	return jsonify(result=disease_query())

@app.route('/get_subjects')
def get_subjects():
	return jsonify(result=subject_query())
###########################################
# These are probably never called
@app.route('/set_people')
def set_people():
	people = json.loads(request.args.get('data'))

	peep_file = '';
	for peep in people:
		peep_name = peep['name']
		peep_uri = peep_name.replace(' ', '-')
		peep_email = peep['email']
		peep_file += 'aop:' + peep_uri + '\n\tfoaf:name "' + peep_name + '" ' 
		if(peep_email!=''):
			peep_file += ';\n\tschema:email "' + peep_email + '" '
		peep_file += '.\n'
	
	# add prefixes then send all notes to Fuseki
	insert_peep = set_aop()
	insert_peep += "\n INSERT { %s } WHERE {}" %peep_file
	sparql = SPARQLWrapper(triplestore_url + "/update")
	sparql.setQuery(insert_peep) 
	sparql.method = 'POST'

	return jsonify(result=peep_file) #TESTCOMMENT

@app.route('/set_places')
def set_places():
	places = json.loads(request.args.get('data'))

	places_file = '';
	for p in place:
		place_name = p['place']
		place_uri = place_name.replace(' ', '-')
		place_loc = p['location']
		places_file += 'aoplace:' + place_uri + '\n\ta foaf:Organization ;\n' 
		places_file += '\tfoaf:name "' + place_name + '" ;\n'
		places_file += '\t'
	
	# add prefixes then send all notes to Fuseki
	insert_peep = set_aop()
	insert_peep += "\n INSERT { %s } WHERE {}" %peep_file
	sparql = SPARQLWrapper(triplestore_url + "/update")
	sparql.setQuery(insert_peep) 
	sparql.method = 'POST'

	return jsonify(result=send_places())

@app.route('/set_publishers')
def set_publishers():
	publishers = json.loads(request.args.get('data'))

	pub_file = '';
	for pub in publishers:
		pub_name = pub['publisher']
		pub_uri = pub_name.replace(' ', '-')
		pub_file += 'aopub:' + pub_uri + '\n\ta dbpedia-owl:Publisher ;\n'
		pub_file += '\tfoaf:name "' + pub_name + '" .\n' 
	
	# add prefixes then send all notes to Fuseki
	insert_pub = set_aopub()
	insert_pub += "\n INSERT { %s } WHERE {}" %pub_file
	sparql = SPARQLWrapper(triplestore_url + "/update")
	sparql.setQuery(insert_pub) 
	sparql.method = 'POST'

	return jsonify(result=pub_file) #TESTCOMMENT
############################################

if __name__ == '__main__':
	app.run(debug=True)

# send a bunch of shtuff to fuseki
def send_people():
	return "NO"
def send_places():
	return "AH"
def send_publishers():
	return "R"
# query to check if item already exists...

def create_author(author):
	return "aop:" + author.replace(' ', '-')

def create_publisher(publisher):
	return "aopub:" + publisher.replace(' ', '-')

def create_person(person):
	return "aop:" + person.replace(' ', '-')

def create_place(place):
	return "aoplace:" + place.replace(' ', '-')


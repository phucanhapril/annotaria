#!/Python27/python

from flask import Flask, render_template, jsonify, request
#(needed so Flask knows where to look for templates, etc.)
app = Flask(__name__)

#bind URL to function
@app.route('/')
def index():
	return render_template('index.html')

@app.route('/_helloworld')
def hello_world():
    return jsonify(reply='Hello world!')

@app.route('/_helloperson')
def hello_name():
	myname = request.args.get('myname')
	return jsonify(yourname=myname)

@app.route('/_jsonmanip')
def json_play():
	mykey = request.args.get('thekey')
	if(mykey=='boy'):
		newval = 'garcon'
	else:
		newval = 'fille'
	return jsonify(translation=newval)

@app.route('/hello/<username>', methods=['GET','POST'])
def hello_person():
	if request.method=='POST':
		return 'Hello %s' %username
	else:
		return 'Hello...'

#server only runs if script executed directly from python interpreter
if __name__ == '__main__':
	#run local server with our app, server reloads on code changes
    app.run(debug=True)
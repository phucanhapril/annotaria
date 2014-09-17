from flask import Flask, render_template, request, jsonify
 
app = Flask(__name__, static_url_path='')      
 
@app.route('/')
def home():
  return render_template('app.html')

@app.route('/jsonplay')
def jsonplay():
	annotator = request.args.get('name')
	if(annotator=='april'):
		return jsonify(result='great')
	else:
		return jsonify(result='fucking terrible')
 
if __name__ == '__main__':
  app.run(debug=True)
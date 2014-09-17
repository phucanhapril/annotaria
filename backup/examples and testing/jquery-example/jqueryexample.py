# -*- coding: utf-8 -*-

from flask import Flask, jsonify, render_template, request
app = Flask(__name__)


@app.route('/_add_numbers')
def add_numbers():
    """Add two numbers server side, ridiculous but well..."""
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)


@app.route('/') #url for index page
def index():
    return render_template('index.html')

#server only runs if script executed directly from python interpreter
if __name__ == '__main__':
    #run local server with our app, server reloads on code changes
    app.run(debug=True)

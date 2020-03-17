import flask
from webargs import fields
import ecdsa.ellipticcurve as ecc
from binascii import hexlify, unhexlify
from hashlib import sha256
import hashlib
from webargs.flaskparser import use_args
from sphinx import HashToBase, curve_256
from ecdsa.ellipticcurve import Point
import sys
import sqlite3
import logging
import os

logging.basicConfig(level=logging.DEBUG)
app = flask.Flask(__name__)
app.config["DEBUG"] = True

DEVICEDB = "device.db"

"""
usage:

python api.py

format of query:
http://host:port/?x=1&y=2&index=3

and example of using the API:

http://127.0.0.1:5000/?x=57185021195497729891603218453125069795440733460445366762459379876967695624603&y=101531608396333685295873043845451164388377596561242906809607293276570205058574

"""

# Helper functions
def execute_close(query: str, args: tuple, commit: bool=False) -> list:
    conn = sqlite3.connect(DEVICEDB)
    c = conn.cursor()
    if args:
        result = c.execute(query, args).fetchall()
    else:
        result = c.execute(query).fetchall()

    if commit:
        conn.commit()

    conn.close()
    return result

def init():
    return execute_close('''CREATE TABLE IF NOT EXISTS device
                 (x text, y text, d text)''', None, commit=True)

def insert(x, y, d):
    return execute_close("INSERT INTO device (x, y, d) VALUES (?, ?, ?)", (x,y,d), commit=True)

def query(x, y):
    return execute_close('SELECT d FROM device WHERE x=(?) AND y=(?) LIMIT 1;', (x,y))

def queryAll():
    return execute_close('SELECT * FROM device', None)

# initialise db
init()

@app.route('/', methods=['GET'])
@use_args({"x": fields.Int(required=True), "y":fields.Int(required=True), "index":fields.Int(missing=1)}, location="query")
# TODO: check if x and y are less than curve_256.p()
def Device(args):
    '''input the point on the curve. If it is in the Group, we store
       a random key D that corresponds to this point, and return the point
       exponeniated to D.
    '''
    try:
        # check if curve contains points
        if curve_256.contains_point(int(args['x']), int(args['y'])) != True:
           raise ValueError("Point ({},{}) does not exist on {}".format(args['x'], args['y'], curve_256))

        # convert x and y into a point on curve_256
        alpha = Point(curve_256, int(args["x"]), int(args["y"]))

        # Check if this point is in my database
        result = query(str(int(alpha.x())), str(int(alpha.y())))
        if result:
            d = int(result[0][0])
        else:
            randomBytes = os.urandom(32)
            d = int(HashToBase(randomBytes, args["index"]))
            insert(str(int(alpha.x())), str(int(alpha.y())), str(int(d)))
        logging.info("DEVICE: Storing d: {}".format(d))

        beta = d * alpha # beta = alpha^d

        return flask.jsonify({"x": beta.x(), "y":beta.y()})

    except:
        return flask.jsonify({"error": str(sys.exc_info())})

@app.route('/device', methods=['GET'])
def getAll():
    result = queryAll()
    return flask.jsonify(queryAll())

app.run()

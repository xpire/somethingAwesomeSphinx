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

def str_int(integer):
    return "{:d}".format(integer)

# Helper functions
def init():
    conn = sqlite3.connect(DEVICEDB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS device
                 (x_value string, y_value string, device_key string)''')
    conn.commit()
    conn.close()

def insert(Point, d):
    conn = sqlite3.connect(DEVICEDB)
    c = conn.cursor()
    c.execute("INSERT INTO device VALUES (?, ?, ?)", (str_int(Point.x()), str_int(Point.y()), str_int(d)))
    conn.commit()
    conn.close()

def query(Point):
    conn = sqlite3.connect(DEVICEDB)
    c = conn.cursor()
    result = c.execute('SELECT * FROM device WHERE x_value=(?) AND y_value=(?) LIMIT 1;', (str_int(Point.x()), str_int(Point.y()))).fetchall()
    conn.close()
    return result

def queryAll():
    conn = sqlite3.connect(DEVICEDB)
    c = conn.cursor()
    result = c.execute("pragma table_info('device');").fetchall()
    conn.close()
    return result

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
        # convert x and y into a point on curve_256
        alpha = Point(curve_256, int(args["x"]), int(args["y"]))
        #if curve_256.contains_point(alpha.x(), alpha.y()) != True:
        #    raise ValueError("Point {} does not exist on curve {}".format(alpha, curve_256))
        # Check if this point is in my database
        result = query(alpha)
        logging.info(result)
        if result:
            result = result[0]
        else:
            randomBytes = os.urandom(32)
            d = HashToBase(randomBytes, args["index"])
            result = d
            insert(alpha, d)
        logging.info("DEVICE: I am going to store d: {}".format(d))
        beta = d * alpha # beta = alpha^d
        # TODO store d in database, key is the curve coordinates x||y.
        return flask.jsonify({"x": beta.x(), "y":beta.y()})
    except:
        return flask.jsonify({"error": str(sys.exc_info())})

@app.route('/device', methods=['GET'])
def getAll():
    result = queryAll()
    logging.info(result)
    return flask.jsonify(queryAll())
app.run()

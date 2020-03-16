import ecdsa.ellipticcurve as ecc
from binascii import hexlify, unhexlify
from hashlib import sha256
import hashlib
from ecdsa import NIST256p
import os


'''
This is my implementation of SPHINX's DE-PAKE algorithm, written in python on top of the `ecdsa` python package.

Usage: 
# --------- Start Client --------- 
alpha = clientToPoint(pwd + domain)
# ---------  End Client  ---------

# send alpha to Device

# --------- Start Device ---------
beta = deviceToClient(alpha)
# ---------  End Device  ---------

# send beta to Client

# --------- Start Client ---------
rwd = clientToPassword(beta)
print("CLIENT: my password is", rwd)
# ---------  End Client  ---------
'''


# https://github.com/warner/python-ecdsa/blob/333ee3feb1dfc6797db7a83d221e5a3a9fafdc3f/src/ecdsa/ecdsa.py
#  ----------------------------- Begin NIST Curve P-256: -----------------------------
PRIME = 115792089210356248762697446949407573530086143415290314195533631308867097853951
R = 115792089210356248762697446949407573529996955224135760342422259061068512044369
# s = 0xc49d360886e704936a6678e1139d26b7819f7e90L
# c = 0x7efba1662985be9403cb055c75d4f7e0ce8d84a9c5114abcaf3177680104fa0dL
A = -3
B = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
Gx = 0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296
Gy = 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5

curve_256 = ecc.CurveFp(PRIME, A, B, 1)
curve_256_generator = ecc.PointJacobi(curve_256, Gx, Gy, 1, R, generator=True)
# ----------------------------- END NIST Curve P-256: -------------------------------

# https://github.com/bdauvergne/python-pkcs1/blob/master/pkcs1/primitives.py
def OS2IP(x: str) -> int:
    '''Converts the byte string x representing an integer reprented using the
       big-endian convient to an integer.
    '''
    h = hexlify(x) #.binascii
    return int(h, 16)

# https://github.com/bdauvergne/python-pkcs1/blob/master/pkcs1/primitives.py
def I2OSP(x: int, x_len: int = 4) -> str:
    '''Converts the integer x to its big-endian representation of length
       x_len.
    '''
    if x > 256**x_len:
        raise ValueError("Integer too large.")
    h = hex(x)[2:]
    if h[-1] == 'L':
        h = h[:-1]
    if len(h) & 1 == 1:
        h = '0%s' % h
    x = unhexlify(h) #.binascii
    return b'\x00' * int(x_len-len(x)) + x

# https://tools.ietf.org/html/draft-irtf-cfrg-hash-to-curve-02#appendix-C.5
def HashToBase(x: bytearray, i: int, label: str="label", p: int=NIST256p.order) -> int:
    '''Hashes the bytearray x with a label string, the hash call index i, and
       returns y, a value in the field F_p
    '''
    H = sha256()
    toHash = ["h2c", label, I2OSP(i, 4), x]
    H.update(b"hc2")
    H.update(label.encode())
    H.update(I2OSP(i,4))
    H.update(x)
    t1 = H.digest()
    t2 = OS2IP(t1)
    return (t2 % p) # = y

# https://tools.ietf.org/html/draft-irtf-cfrg-hash-to-curve-02#section-5.2.3
# Implementation of H' which maps from bytearray -> g \in G
def map2curve_simple_swu(alpha: bytearray) -> ecc.Point:
    '''Maps the octet bytearray alpha into the elliptic curve, and returns a 
       point from the elliptic curve.
    '''
    t =  HashToBase(alpha, 1)
    alpha = pow(t, 2, PRIME)
    alpha = -alpha % PRIME
    right = (pow(alpha, 2, PRIME) + alpha) % PRIME
    right = pow(right, PRIME-2, PRIME) # right^(-1) % PRIME    
    right = (right + 1)  % PRIME
    left = -B % PRIME
    left =  (left * pow(A, PRIME-2, PRIME)) % PRIME # (left * A^-1) % PRIME
    x2 = (left * right) % PRIME
    x3 = (alpha * x2)  % PRIME
    h2 = pow(x2, 3, PRIME) # x2 ^ 3  % PRIME
    i2 = (x2 * A)  % PRIME
    i2 = (i2 + B) % PRIME
    h2 = (h2 + i2)  % PRIME
    h3 = pow(x3, 3, PRIME) # x3 ^ 3  % PRIME
    i3 = (x3 * A)  % PRIME
    i3 = (i3 + B)  % PRIME
    h3 = (h3 + i3)  % PRIME
    y1 = pow(h2, (PRIME+1) // 4, PRIME) # h2 ^ ((p + 1) / 4)  % PRIME
    y2 = pow(h3, (PRIME+1) // 4, PRIME) # h3 ^ ((p + 1) / 4)  % PRIME
    if pow(y1, 2, PRIME) == h2:
        return ecc.Point(curve_256, x2, y1)
    else:
        return ecc.Point(curve_256, x3, y2)

# ----------------------------- Helper Functions -----------------------------
# Oblivious Psuedo-Random Function
def OPRF(x: str, point: ecc.Point) -> bytearray:
    '''Performs the actual Hash H of H(x, (H'(X))^d), which is the hash of a 
       bytearray x and a Point on the curve. Returns a bytearray result.
    '''
    H = sha256()
    H.update(x.encode())
    H.update(I2OSP(point.x(), 256))
    H.update(I2OSP(point.y(), 256))
    return H.digest()

def gen_password(rwd: bytearray, length: int=32, charset: str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()") -> str:
    '''Generates the password based on the result of the OPRF function
    ''' 
    len_charset = len(charset)
    indices = [int(len_charset * (ord(chr(byte)) / 256.0)) for byte in rwd]
    return "".join([charset[index] for index in indices])

# Client 1
def clientToPoint(pwd: str) -> (ecc.Point, int):
    '''input the master password pwd and returns a point on the curve alpha
       with the random integer that was used to blind it.
    '''
    hdashx = map2curve_simple_swu(pwd.encode())
    rho = OS2IP(os.urandom(32))
    return hdashx * rho, rho # alpha = hdashx^rho

# Device
# def deviceToClient(alpha: ecc.Point, index: int=1) -> ecc.Point:
#     '''input the point on the curve. If it is in the Group, we store
#        a random key D that corresponds to this point, and return the point
#        exponeniated to D.
#     '''
#     if curve_256.contains_point(alpha.x(), alpha.y()) != True:
#         raise ValueError("Point {} does not exist on curve {}".format(alpha, curve_256))
#     randomBytes = os.urandom(32)
#     d = HashToBase(randomBytes, index)
#     print("DEVICE: I am going to store d: ", d)
#     return d * alpha, d # beta = alpha^d

# Client 2
def clientToPassword(beta: ecc.Point) -> str:
    '''input the point on the curve. If it is in the Group, we compute
       this point exponeniated to the inverse of rho, and then we use the 
       OPRF to create the byte array which generates the final password rwd
    '''
    if curve_256.contains_point(beta.x(), beta.y()) != True:
        raise ValueError("Point {} does not exist on curve {}".format(beta, curve_256))
    final = beta * pow(rho, ORDER-2, ORDER)
    rwdbytes = OPRF(x, final)
    return gen_password(rwdbytes)

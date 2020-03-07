# from ecdsa.ecdsa import CurveFp, PointJacobi, Point
from ecdsa.ellipticcurve import *

def sendDH(privateKey, generator, sendFunction):
   return sendFunction(privateKey * generator)

def receiveDH(privateKey, receiveFunction):
   return privateKey * receiveFunction()

prime = 3851
a = 324
b = 1287
myCurve = CurveFp(prime, a, b, 1)
basePoint = Point(myCurve, 920, 303)

print(myCurve)
print(basePoint)

aliceSecretKey = 233# generateSecretKey(8)
bobSecretKey = 25# generateSecretKey(8)

alicePublicKey = sendDH(aliceSecretKey, basePoint, lambda x:x)
bobPublicKey = sendDH(bobSecretKey, basePoint, lambda x:x)

sharedSecret1 = receiveDH(bobSecretKey, lambda: alicePublicKey)
sharedSecret2 = receiveDH(aliceSecretKey, lambda: bobPublicKey)
print('Shared secret is %s == %s' % (sharedSecret1, sharedSecret2))

def IntegersModP(p):
    class IntegerModP(FieldElement):
        def __init__(self, n):
            self.n = n % p
            self.field = IntegerModP
    
        def __add__(self, other): return IntegerModP(self.n + other.n)
        def __sub__(self, other): return IntegerModP(self.n - other.n)
        def __mul__(self, other): return IntegerModP(self.n * other.n)
        def __truediv__(self, other): return self * other.inverse()
        def __div__(self, other): return self * other.inverse()
        def __neg__(self): return IntegerModP(-self.n)
        def __eq__(self, other): return isinstance(other, IntegerModP) and self.n == other.n
        def __abs__(self): return abs(self.n)
        def __str__(self): return str(self.n)
        def __repr__(self): return '%d (mod %d)' % (self.n, self.p)
    
        def __divmod__(self, divisor):
            q,r = divmod(self.n, divisor.n)
            return (IntegerModP(q), IntegerModP(r))
    
        def inverse(self):
            x,y,d = extendedEuclideanAlgorithm(self.n, self.p)
            return IntegerModP(x)def inverse(self):
    
    IntegerModP.p = p
    IntegerModP.__name__ = 'Z/%d' % (p)
    return IntegerModP

def gcd(a, b):
    if abs(a) < abs(b):
        return gcd(b, a)
    
    while abs(b) > 0:
        q,r = divmod(a,b)
        a,b = b,r
    
    return a

def extendedEuclideanAlgorithm(a, b):
    if abs(b) > abs(a):
        (x,y,d) = extendedEuclideanAlgorithm(b, a)
        return (y,x,d)
    
    if abs(b) == 0:
        return (1, 0, a)
    
    x1, x2, y1, y2 = 0, 1, 1, 0
    while abs(b) > 0:
        q, r = divmod(a,b)
        x = x2 - q*x1
        y = y2 - q*y1
        a, b, x2, x1, y2, y1 = b, r, x1, x, y1, y
    
    return (x2, y2, a)

def typecheck(f):
    def newF(self, other):
        if type(self) is not type(other):
            try:
                other = self.__class__(other)
            except TypeError:
                message = 'Not able to typecast %s of type %s to type %s in function %s'
                raise TypeError(message % (other, type(other).__name__, type(self).__name__, f.__name__))
            except Exception as e:
                message = 'Type error on arguments %r, %r for functon %s. Reason:%s'
                raise TypeError(message % (self, other, f.__name__, type(other).__name__, type(self).__name__, e))
    
        return f(self, other)
    
    return newF


class DomainElement(object):
    def __radd__(self, other): return self + other
    def __rsub__(self, other): return -self + other
    def __rmul__(self, other): return self * other
 
class FieldElement(DomainElement):
    def __truediv__(self, other): return self * other.inverse()
    def __rtruediv__(self, other): return self.inverse() * other
    def __div__(self, other): return self.__truediv__(other)
    def __rdiv__(self, other): return self.__rtruediv__(other)

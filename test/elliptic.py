class Point(object):
    def __init__(self, curve, x, y):
        self.x = x
        self.y = y
        self.curve = curve
        # check if point is on curve
        if not curve.test(x, y):
            raise Exception("Point %s is not on Curve %s" % (self, self.curve))

    def __str__(self):
        return "(%G, %G)" % (self.x, self.y)

    # implement Group operations: neg, add, sub
    def __neg__(self):
        return Point(self.curve, self.x, -self.y)

    def __add__(self, Q):
        if isinstance(Q, Ideal):
            return self

        x_1, y_1, x_2, y_2 = self.x, self.y, Q.x, Q.y

        if (x_1, y_1) == (x_2, y_2):
            if y_1 == 0:
                return Ideal(self.curve)

            # slope of the tangent line
            m = (3 * x_1 * x_1 + self.curve.a) / (2 * y_1)
        else:
            if x_1 == x_2:
                return Ideal(self.curve)

            # slope of the secant line
            m = (y_2 - y_1) / (x_2 - x_1)

        x_3 = m*m - x_2 - x_1
        y_3 = m*(x_3 - x_1) + y_1

        return Point(self.curve, x_3, -y_3)
class Ideal(Point):
    def __init__(self, curve):
        self.curve = curve

    def __str__(self):
        return "Ideal"

    def __neg__(self):
        return self

    def __add__(self, Q):
        return Q

# Elliptic Curve Object
class EllipticCurve(object):
    # y^2 = x^3 + ax + b
    def __init__(self, a, b):
        self.a = a
        self.b = b
        # discrimant = 4a^3 + 27b^2
        self.discrimant = 4 * (self.a) ** 3 + 27 * (self.b) ** 2
        if not self.isSmooth():
            raise Exception("Curve %s is not sufficiently smooth" % self)

    def __str__(self):
        return "y^2 = x^3 + %Gx + %G" % (self.a, self.b)

    # implement smooth function that checks discriminant != 0
    def isSmooth(self):
        return self.discrimant != 0

    # implement test function that checks if point lies on curve
    def test(self, x, y):
        return y * y == x * x * x + self.a * x + self.b
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get 0() {
        return this.x;
    }

    get 1() {
        return this.y;
    }

    // Add another vector to this one
    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    // Subtract another vector from this one
    subtract(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    // 
    scale(factor) {
        return new Vec2(this.x * factor, this.y * factor);
    }

    // Calculate the magnitude (length) of the vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize the vector (make it 1 unit in length)
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vec2(); // Return a zero vector if the magnitude is 0
        }
        return new Vec2(this.x / mag, this.y / mag);
    }

    // Rotate the vector by 90 degrees
    rotate90Degrees() {
        return new Vec2(-this.y, this.x);
    }

    // Rotate the vector by 90 degrees
    rotate(alpha) {
        const s = Math.sin(alpha)
        const c = Math.cos(alpha)
        return new Vec2(c*this.x - s*this.y, s*this.x + c*this.y);
    }

    // Utility method to display the vector as a string
    toString() {
        return `Vec2(${this.x}, ${this.y})`;
    }
}

// Example usage
//const v1 = new Vec2(1, 2);
//const v2 = new Vec2(3, 4);

//console.log('Add: ', v1.add(v2).toString());
//console.log('Subtract: ', v1.subtract(v2).toString());
//console.log('Magnitude of v1: ', v1.magnitude());
//console.log('Normalized v1: ', v1.normalize().toString());
//console.log('v1 rotated 90 degrees: ', v1.rotate90Degrees().toString());

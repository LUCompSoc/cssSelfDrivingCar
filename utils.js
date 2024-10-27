// This function performs linear interpolation (lerp) between two points A and B based on a factor t.
// t is a value between 0 and 1, where 0 returns A and 1 returns B. Values between 0 and 1 move between A and B.
function lerp(A, B, t) {
    return A + (B - A) * t; // The formula for interpolation
}

// This function checks if two lines (AB and CD) intersect, and if they do, it returns the point of intersection.
// A and B are points defining the first line, and C and D define the second line.
function getIntersection(A, B, C, D) {
    // Numerator for calculating the t value (how far along AB the intersection is)
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    
    // Numerator for calculating the u value (how far along CD the intersection is)
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    
    // Denominator for both t and u, represents whether the lines are parallel or not
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    // If bottom is 0, the lines are parallel and don't intersect, so we return null.
    if (bottom != 0) {
        // Calculate the t and u values (scalars that tell us where the intersection happens on the lines)
        const t = tTop / bottom;
        const u = uTop / bottom;

        // If t and u are between 0 and 1, it means the lines intersect within the line segments.
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t), // x coordinate of the intersection point
                y: lerp(A.y, B.y, t), // y coordinate of the intersection point
                offset: t             // t is returned in case it's needed later for further calculations
            }
        }
    }

    // If the lines don't intersect within the segments, return null (no intersection).
    return null;
}

// This function checks if two polygons (poly1 and poly2) intersect.
// A polygon is represented as an array of points, where each point is an object with x and y properties.
function polysIntersect(poly1, poly2) {
    // Loop through each edge of poly1
    for (let i = 0; i < poly1.length; i++) {
        // Loop through each edge of poly2
        for (let j = 0; j < poly2.length; j++) {
            // Get the intersection of two edges:
            // poly1[i] to poly1[(i+1) % poly1.length] for poly1's edge
            // poly2[j] to poly2[(j+1) % poly2.length] for poly2's edge
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length], // Handles wrapping to the first point when reaching the end of the array
                poly2[j],
                poly2[(j + 1) % poly2.length]  // Same wrapping logic for poly2
            );
            
            // If any edge of poly1 intersects with any edge of poly2, return true (polygons intersect)
            if (touch) {
                return true;
            }
        }
    }
    // If no intersection is found after checking all edges, return false (polygons do not intersect).
    return false;
}

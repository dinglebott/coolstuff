$(window).on("load", function() {
    $("body").attr("class", "");
});

$(".button").mouseenter(function() {
    $(this).css("background-color", "rgb(20, 30, 100)");
});

$(".button").mouseleave(function() {
    $(this).css("background-color", "");
});

$("#homeButton").click(function() {
    location.href = "../index.html"
});

//toggle detailed explanation
$("#readMore").click(function() {
    if ($(".extra").css("display") == "none") {
        $(".extra").css({
            "display": "block"
        });
        $(this).text("(Click to hide explanation)");
    } else {
        $(".extra").css({
            "display": "none"
        });
        $(this).text("(More about the 3-body problem)");
    }
});

//toggle sim explanation
$("#readMore2").click(function() {
    if ($(".simExpl").css("display") == "none") {
        $(".simExpl").css({
            "display": "block"
        });
        $(this).text("(Click to hide info)");
        document.getElementById("last").scrollIntoView({behavior: "smooth"});
    } else {
        $(".simExpl").css({
            "display": "none"
        });
        $(this).text("About the simulation (nerd warning)");
    }
});

/* INITIALISE BODIES */
class Body {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.ax2 = 0;
        this.ay2 = 0;
        this.colour = colour;
        this.trail = [];
    }
    reset() {
        switch (this.colour) {
            case "red":
                this.x = 750;
                this.y = 350;
                break;
            case "green":
                this.x = 1350;
                this.y = 800;
                break;
            case "blue":
                this.x = 1400;
                this.y = 400;
                break;
        }
        this.vx = this.vy = this.ax = this.ay = this.ax2 = this.ay2 = 0;
        this.trail = [];
    }
}
const bodyA = new Body(750, 350, "red");
const bodyB = new Body(1350, 800, "green");
const bodyC = new Body(1400, 400, "blue");
const bodies = [bodyA, bodyB, bodyC];

/* INITIALISE CANVAS */
const sim = document.getElementById("sim");
const ctx = sim.getContext("2d");
/* HELPER FUNCTIONS */
//convert canvas coords to real-world units
function getRealCoords(body) {
    //centred origin, reversed y direction
    //native units 10^8m, divide by 10 to convert to billions of metres
    return {
        x: (body.x - 1100) / 10,
        y: (500 - body.y) / 10
    };
}
//convert DOM coords to canvas coord system
const simWidth = sim.getBoundingClientRect().width;
const simHeight = sim.getBoundingClientRect().height;
function getCanvasCoords(x, y) {
    //subtract canvas offset
    const unscaledX = x - sim.getBoundingClientRect().left;
    const unscaledY = y - sim.getBoundingClientRect().top;
    //scale to canvas and return
    return {
        x: unscaledX * (2200/simWidth),
        y: unscaledY * (1000/simHeight)
    };
}
//distance finder
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
}
/* MAIN DRAWING FUNCTION: draws axes and scale, updates positions AND display panels */
function drawBodies() {
    ctx.clearRect(0, 0, sim.width, sim.height);
    //draw coordinate axes
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.lineTo(2200, 500);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1100, 0);
    ctx.lineTo(1100, 1000);
    ctx.lineWidth = 5;
    ctx.stroke();
    //draw scale (374px = 0.25AU)
    ctx.beginPath();
    ctx.moveTo(2150, 930);
    ctx.lineTo(2150, 970);
    ctx.lineTo(2150, 950);
    ctx.lineTo(1776, 950);
    ctx.lineTo(1776, 930);
    ctx.lineTo(1776, 970);
    ctx.stroke();
    //draw bodies
    for (const body of bodies) {
        ctx.beginPath();
        ctx.fillStyle = body.colour;
        ctx.arc(body.x, body.y, 30, 0, 2*Math.PI);
        ctx.fill();
    }
    //update position panel
    $("#Ax").text(String(Math.round(getRealCoords(bodyA).x)));
    $("#Ay").text(String(Math.round(getRealCoords(bodyA).y)));
    $("#Bx").text(String(Math.round(getRealCoords(bodyB).x)));
    $("#By").text(String(Math.round(getRealCoords(bodyB).y)));
    $("#Cx").text(String(Math.round(getRealCoords(bodyC).x)));
    $("#Cy").text(String(Math.round(getRealCoords(bodyC).y)));
    //update velocity panel (dividing by 100 converts to km/s, flip sign for y)
    $("#Avx").text(String(Math.round(bodyA.vx / 100)));
    $("#Avy").text(String(Math.round(bodyA.vy / -100)));
    $("#Bvx").text(String(Math.round(bodyB.vx / 100)));
    $("#Bvy").text(String(Math.round(bodyB.vy / -100)));
    $("#Cvx").text(String(Math.round(bodyC.vx / 100)));
    $("#Cvy").text(String(Math.round(bodyC.vy / -100)));
}
drawBodies();
//trail drawing function
function drawTrails() {
    for (const body of bodies) {
        ctx.strokeStyle = body.colour;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(body.trail[0].x, body.trail[0].y);
        for (const point of body.trail) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

/* DRAG N DROP BEHAVIOUR */
//start drag
let liftedBody = null;
sim.addEventListener("mousedown", function(e) {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (getDistance(coords.x, coords.y, bodyA.x, bodyA.y) <= 30) {
        liftedBody = bodyA;
    } else if (getDistance(coords.x, coords.y, bodyB.x, bodyB.y) <= 30) {
        liftedBody = bodyB;
    } else if (getDistance(coords.x, coords.y, bodyC.x, bodyC.y) <= 30) {
        liftedBody = bodyC;
    }
});
sim.addEventListener("touchstart", function(e) {
    const coords = getCanvasCoords(e.touches.item(0).clientX, e.touches.item(0).clientY);
    if (getDistance(coords.x, coords.y, bodyA.x, bodyA.y) <= 30) {
        liftedBody = bodyA;
    } else if (getDistance(coords.x, coords.y, bodyB.x, bodyB.y) <= 30) {
        liftedBody = bodyB;
    } else if (getDistance(coords.x, coords.y, bodyC.x, bodyC.y) <= 30) {
        liftedBody = bodyC;
    }
});
//during drag
sim.addEventListener("mousemove", function(e) {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    switch (liftedBody) {
        case bodyA:
            bodyA.x = coords.x;
            bodyA.y = coords.y;
            drawBodies();
            break;
        case bodyB:
            bodyB.x = coords.x;
            bodyB.y = coords.y;
            drawBodies();
            break;
        case bodyC:
                bodyC.x = coords.x;
                bodyC.y = coords.y;
                drawBodies();
                break;
    }
});
sim.addEventListener("touchmove", function(e) {
    const coords = getCanvasCoords(e.touches.item(0).clientX, e.touches.item(0).clientY);
    switch (liftedBody) {
        case bodyA:
            bodyA.x = coords.x;
            bodyA.y = coords.y;
            drawBodies();
            break;
        case bodyB:
            bodyB.x = coords.x;
            bodyB.y = coords.y;
            drawBodies();
            break;
        case bodyC:
                bodyC.x = coords.x;
                bodyC.y = coords.y;
                drawBodies();
                break;
    }
});
//after drag
sim.addEventListener("mouseup", function() {
    liftedBody = null;
});
sim.addEventListener("mouseleave", function() {
    liftedBody = null;
});
sim.addEventListener("touchend", function() {
    liftedBody = null;
});


/* PHYSICS ENGINE */
//Units: 10^28kg, 10^8m --> 1px, 10^7s
let simRunning = false;
let timeElapsed = 0;
const G = 66743000;
let dt = 0.0004;
let prevT = null; //for framerate responsiveness
//increase dt if slow refresh rate
setTimeout(function() {
    if (hz <= 90) {
        dt = 0.0008;
    }
    console.log(`Value of dt: ${dt}`);
}, 400);
//find acceleration of body1 due to body2
function gAccel(body1, body2) {
    const r = getDistance(body1.x, body1.y, body2.x, body2.y);
    const rE = Math.sqrt(r*r + 2500);
    const mag = (G*200) / (rE*rE);
    return {
        x: mag * ((body2.x - body1.x) / rE),
        y: mag * ((body2.y - body1.y) / rE)
    };
}
//MAIN ANIMATION FUNCTION (Verlet integration lives here!)
function nextFrame(t) {
    //initial velocities and accelerations are all 0
    //update dt for framerate
    if (prevT) {
        dt = 0.0004 * ((t - prevT) / 6.06);
    }
    prevT = t;
    //update position
    for (const body of bodies) {
        body.x += body.vx*dt + 0.5*body.ax*dt*dt;
        body.y += body.vy*dt + 0.5*body.ay*dt*dt;
        //add trail point
        if (body.trail.length < 500) {
            body.trail.push({
                x: body.x,
                y: body.y
            });
        } else {
            body.trail.shift();
            body.trail.push({
                x: body.x,
                y: body.y
            });
        }
    }
    //calculate new accelerations
    for (const body of bodies) {
        //reset new accelerations
        body.ax2 = body.ay2 = 0;
        //iterate through the other bodies
        for (let i = 0; i < 3; i++) {
            if (bodies[i] != body) {
                body.ax2 += gAccel(body, bodies[i]).x;
                body.ay2 += gAccel(body, bodies[i]).y;
            }
        }
    }
    //update velocities
    for (const body of bodies) {
        body.vx += 0.5*(body.ax + body.ax2)*dt;
        body.vy += 0.5*(body.ay + body.ay2)*dt;
    }
    //actual drawing
    drawBodies();
    if ($("#showTrails").is(":checked")) {
        drawTrails();
    }
    //update current acceleration
    for (const body of bodies) {
        body.ax = body.ax2;
        body.ay = body.ay2;
    }
    //update elapsed time
    timeElapsed += dt * 115.741; //dt * 10^7s to days
    $("#timeElapsed").text(`${Math.round(timeElapsed)} days`);
    //call next frame
    if (simRunning) {   
        requestAnimationFrame((t) => {
            nextFrame(t);
        });
    }
}

$("#run").click(function() {
    if (!simRunning) {
        simRunning = true;
        prevT = null;
        requestAnimationFrame(nextFrame);
    }
});
$("#stop").click(function() {
    if (simRunning) {
        simRunning = false;
        prevT = null;
    }
});
$("#reset").click(function() {
    for (body of bodies) {
        body.reset();
    }
    timeElapsed = 0;
    drawBodies();
    prevT = null;
    simRunning = false;
});
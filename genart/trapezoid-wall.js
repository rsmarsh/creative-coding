const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {

  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes))

  const createGrid = () => {
    const points = [];
    const count = 6;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x/(count-1);
        const v = count <= 1 ? 0.5 : y/(count-1);
        // const radius = Math.abs(random.noise2D(u,v)*0.5); 


        points.push({
          color: random.pick(palette),
        //   radius,
          position: [u, v],
        //   rotation: random.noise2D(u, v) * 5
        });
      }
    }

    return points;
  };

  random.setSeed(random.getRandomSeed());
  console.log(random.getSeed());
  let points = createGrid();
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = 'orange';
    context.fillRect(0,0, width, height);

    console.log(points.length);

    const bottomY = height-margin;

    // stop if there is one or zero points remaining
    while (points.length > 1) {
        points = random.shuffle(points);
        let point1 = points.pop();
        let point2 = points.pop();

        let [u1, v1] = point1.position;
        let [u2, v2] = point2.position;

        // don't allow x axis to be shared, or rectangles
        if (u1 === u2 || v1 === v2) {
            continue;
        }

        

        let xPos1 = lerp(margin, width - margin, u1);
        let yPos1 = lerp(margin, height - margin, v1);
        let xPos2 = lerp(margin, width - margin, u2);
        let yPos2 = lerp(margin, height - margin, v2);

        context.beginPath();    
        context.moveTo(xPos1, yPos1);

        context.lineTo(xPos1, bottomY);
        // connect two random points on the grid
        context.lineTo(xPos2, bottomY);

        // draw lines to the bottom from each point
        context.lineTo(xPos2, yPos2);
        context.lineTo(xPos1, yPos1);

        // fill with a colour
          
        // stroke with a background colour
        context.strokeStyle = "orange";
        context.lineWidth = 20;
        context.fillStyle = point1.color;
        context.fill();

        context.closePath();
        context.stroke();


        // layer the shapes by the average Y position of the two grid points


    }

  };
};

canvasSketch(sketch, settings);

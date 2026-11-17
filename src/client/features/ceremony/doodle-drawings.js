/** Small hand-drawn school/science motifs. The caller supplies ink and layout. */
export const DOODLE_COUNT = 40;

export function drawDoodle(ctx, kind, variant = 0) {
  const tau = Math.PI * 2;
  const v = Math.abs(Math.trunc(variant)) || 0;
  const pick = (values) => values[v % values.length];
  const line = (points, close = false) => {
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    if (close) ctx.closePath();
    ctx.stroke();
  };
  const circle = (x, y, radius) => {
    ctx.beginPath();ctx.arc(x, y, radius, 0, tau);ctx.stroke();
  };
  const ellipse = (x, y, rx, ry, tilt = 0) => {
    ctx.beginPath();ctx.ellipse(x, y, rx, ry, tilt, 0, tau);ctx.stroke();
  };
  const text = (value, x = 0, y = 7, size = 23) => {
    ctx.font = `italic ${size}px Georgia, 'Times New Roman', serif`;
    ctx.textAlign = 'center';ctx.fillText(value, x, y);
  };
  const arrow = (x0, y0, x1, y1, head = 6) => {
    const angle = Math.atan2(y1 - y0, x1 - x0);
    line([[x0, y0], [x1, y1]]);
    line([[x1 - Math.cos(angle - .5) * head, y1 - Math.sin(angle - .5) * head], [x1, y1], [x1 - Math.cos(angle + .5) * head, y1 - Math.sin(angle + .5) * head]]);
  };
  const axes = () => {arrow(-34, 29, 39, 29);arrow(-30, 35, -30, -36);};

  ctx.save();
  ctx.lineCap = 'round';ctx.lineJoin = 'round';ctx.setLineDash([]);
  switch (((Math.trunc(kind) % DOODLE_COUNT) + DOODLE_COUNT) % DOODLE_COUNT) {
    case 0: { // A slightly wonky set square.
      line([[-42, 34], [35, 34], [36, -39]], true);
      line([[-15, 22], [23, 22], [24, -14]], true);
      for (let n = 0; n < 5; n++) line([[-31 + n * 13, 34], [-31 + n * 13, 28 - n % 2 * 3]]);
      break;
    }
    case 1: { // Pencil, with a soft eraser.
      line([[-11, -29], [11, -30], [12, 24], [0, 44], [-11, 25]], true);
      line([[-11, -20], [11, -21]]);line([[-5, -18], [-5, 26], [0, 34], [5, 26], [5, -18]]);
      line([[-5, 36], [0, 44], [4, 36]]);
      ctx.beginPath();ctx.ellipse(0, -29, 11, 5, 0, Math.PI, tau);ctx.stroke();
      break;
    }
    case 2: { // Calculator; display changes between sketches.
      line([[-29, -40], [27, -39], [31, 37], [-28, 40]], true);
      line([[-20, -29], [19, -29], [20, -12], [-20, -12]], true);
      text(pick(['39', 'π', '7²', '1.4']), 0, -16, 12);
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) circle(-16 + col * 16, row * 14, 4.5);
      line([[14, 25], [22, 25], [22, 34], [14, 34]], true);
      break;
    }
    case 3: { // Stack of two or three books.
      const books = v % 2 ? 2 : 3;
      for (let row = 0; row < books; row++) {
        const y = -20 + row * 23;
        line([[-36, y], [20, y + 1], [36, y - 10], [-19, y - 11]], true);
        line([[-36, y], [-36, y + 12], [21, y + 13], [36, y + 2], [36, y - 10]]);
        line([[21, y + 1], [21, y + 13]]);line([[-29, y + 6], [15, y + 7]]);
      }
      break;
    }
    case 4: { // Abacus.
      line([[-33, -40], [33, -40], [34, 40], [-33, 39]], true);
      for (let row = 0; row < 4; row++) {
        const y = -26 + row * 17;line([[-27, y], [27, y]]);
        for (let col = 0; col < 3; col++) ellipse(-20 + col * 12 + (row + v) % 2 * 9, y, 3.4, 7);
      }
      break;
    }
    case 5: { // Globe/sphere.
      circle(0, 0, 35);ellipse(0, 0, 15 + v % 3, 35, -.4);ellipse(0, 0, 35, 13, -.4);
      line([[-22, -31], [25, 28]]);
      break;
    }
    case 6: { // Cone with construction line.
      line([[0, -42], [-29, 28]]);line([[0, -42], [29, 28]]);ellipse(0, 28, 29, 10);
      ctx.setLineDash([4, 6]);line([[0, -36], [0, 27]]);
      break;
    }
    case 7: { // Protractor.
      ctx.beginPath();ctx.arc(0, 18, 36, Math.PI, tau);ctx.stroke();
      ctx.beginPath();ctx.arc(0, 18, 21, Math.PI, tau);ctx.stroke();
      line([[-40, 18], [40, 18], [40, 27], [-40, 27]], true);
      for (let n = 1; n < 6; n++) {
        const a = Math.PI + n * Math.PI / 6;
        line([[Math.cos(a) * 29, 18 + Math.sin(a) * 29], [Math.cos(a) * 35, 18 + Math.sin(a) * 35]]);
      }
      break;
    }
    case 8: { // Sine or cosine, with a hand-drawn axis.
      axes();const points = [];
      for (let n = 0; n <= 28; n++) points.push([-28 + n * 2.3, 5 - Math.sin(n / 28 * tau + (v % 2) * Math.PI / 2) * 21]);
      line(points);text('x', 39, 43, 13);break;
    }
    case 9: { // Spiralling margin doodle.
      const points = [];
      for (let n = 0; n < 65; n++) {const p = n / 64;points.push([Math.cos(p * tau * (2 + v % 3 * .2)) * (2 + p * 32), Math.sin(p * tau * (2 + v % 3 * .2)) * (2 + p * 32)]);}
      line(points);break;
    }
    case 10: {
      line([[-32, -32], [-32, 28], [35, 28]]);line([[-32, 13], [-17, 13], [-17, 28]]);
      text(pick(['90°', '30°', '45°']), 3, 0, 22);break;
    }
    case 11: { // Exploded pie chart.
      ctx.beginPath();ctx.arc(-6, 4, 31, 0, Math.PI * 1.5);ctx.lineTo(-6, 4);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(2, -4);ctx.lineTo(2, -35);ctx.arc(2, -4, 31, Math.PI * 1.5, tau);ctx.closePath();ctx.stroke();break;
    }
    case 12: { // Formula scribble, not a repeated slogan.
      text(pick(['x²+y²', 'E=mc²', 'S=6a²', 'sin x', 'a+b', '100%', 'πr²', '∫ f(x)', '3.14', 'y=mx+b']), 0, 6, 23);
      line([[-33, 22], [-8, 24], [14, 21], [34, 23]]);break;
    }
    case 13: {
      ctx.beginPath();ctx.moveTo(-12, -20);ctx.bezierCurveTo(-14, -43, 24, -42, 24, -19);ctx.bezierCurveTo(24, -3, 2, -5, 4, 14);ctx.stroke();circle(4, 29, 2.7);break;
    }
    case 14: { // A lightning scribble and little downward arrow.
      line([[-36, 7], [-23, -9], [-10, 7], [3, -9], [16, 7], [29, -9]]);
      arrow(8, 20, 8, 42, 9);circle(-24, 30, 4);break;
    }
    case 15: { // Atom, three distinct orbits.
      for (let i = 0; i < 3; i++) ellipse(0, 0, 39, 14, i * Math.PI / 3);
      circle(0, 0, 4);circle(30, -22, 3);circle(-30, -19, 2.5);break;
    }
    case 16: { // Drawing compasses.
      circle(0, -31, 6);line([[-4, -25], [-27, 39], [-17, 21], [1, -14], [20, 23], [29, 39], [5, -25]]);
      line([[-25, 34], [-27, 44]]);line([[28, 34], [31, 42]]);
      ctx.beginPath();ctx.arc(0, -16, 24, .38, 2.77);ctx.stroke();break;
    }
    case 17: { // A little perspective die.
      line([[-33, -22], [19, -31], [35, -14], [34, 30], [-18, 40], [-33, 20]], true);
      line([[-33, -22], [-18, -4], [35, -14]]);line([[-18, -4], [-18, 40]]);
      for (const [x,y] of [[-24,-11],[8,-21],[0,8],[22,14],[0,28],[22,31]]) circle(x,y,2.4);
      break;
    }
    case 18: { // Magnifier.
      circle(-9, -10, 27);circle(-9, -10, 21);line([[10, 11], [33, 37], [40, 30], [17, 5]]);
      ctx.beginPath();ctx.arc(-9, -10, 15, Math.PI, Math.PI * 1.55);ctx.stroke();break;
    }
    case 19: { // Molecule, with different outer labels.
      line([[-9, -6], [-29, -28]]);line([[-5, -9], [13, -33]]);line([[1, 1], [28, 9]]);line([[-8, 6], [-19, 31]]);
      circle(-6, -2, 10);circle(-34, -33, 7);circle(18, -37, 6);circle(35, 10, 7);circle(-21, 38, 6);
      text(pick(['H', 'O', 'C']), -6, 2, 10);break;
    }
    case 20: { // Idea bulb.
      ctx.beginPath();ctx.moveTo(-13, 19);ctx.bezierCurveTo(-11, 6, -27, 4, -27, -15);ctx.bezierCurveTo(-27, -46, 27, -46, 27, -15);ctx.bezierCurveTo(27, 3, 11, 7, 13, 19);ctx.closePath();ctx.stroke();
      line([[-12, 23], [12, 23]]);line([[-10, 29], [10, 29]]);line([[-7, 35], [7, 35]]);
      line([[-6, 16], [-9, -7], [0, -1], [9, -7], [6, 16]]);
      for (const [x,y] of [[-39,-19],[39,-19],[0,-48]]) line([[x*.83,y*.83],[x,y]]);break;
    }
    case 21: { // Paper plane.
      line([[-43, -15], [42, -35], [14, 38], [-1, 7]], true);
      line([[-43, -15], [-1, 7], [42, -35]]);line([[-1, 7], [-8, 29], [5, 19]]);break;
    }
    case 22: { // A looping arrow, like a thought that changed direction.
      ctx.beginPath();ctx.moveTo(-41, 20);ctx.bezierCurveTo(-14, 44, 27, 11, 7, -13);ctx.bezierCurveTo(-15, -40, -27, 6, 4, 10);ctx.bezierCurveTo(26, 15, 35, -7, 39, -31);ctx.stroke();
      line([[28,-25],[39,-31],[44,-18]]);break;
    }
    case 23: { // Open book.
      ctx.beginPath();ctx.moveTo(0,-28);ctx.quadraticCurveTo(-21,-40,-40,-27);ctx.lineTo(-39,31);ctx.quadraticCurveTo(-17,21,0,34);ctx.quadraticCurveTo(21,20,41,30);ctx.lineTo(40,-28);ctx.quadraticCurveTo(20,-40,0,-28);ctx.lineTo(0,34);ctx.stroke();
      for (let i=0;i<3;i++){line([[-31,-14+i*12],[-11,-17+i*13]]);line([[10,-17+i*13],[31,-14+i*12]]);}break;
    }
    case 24: { // Spiral notebook.
      line([[-31,-38],[31,-36],[33,38],[-29,40]],true);
      for(let i=0;i<6;i++)ellipse(-29,-27+i*11,6,3);
      line([[-17,-21],[21,-22]]);line([[-17,-8],[19,-7]]);line([[-17,5],[22,5]]);
      text(pick(['A+', '∑', 'π']),4,29,18);break;
    }
    case 25: { // Parabola / a different graph silhouette.
      axes();const points=[];for(let i=0;i<=30;i++){const x=-23+i*1.8;points.push([x,.044*(x-4)**2-22]);}line(points);
      text(pick(['y', 'f']),-39,-24,14);break;
    }
    case 26: { // Triangular prism.
      line([[-40,25],[-11,-29],[15,28]],true);line([[-11,-29],[15,-43],[42,15],[15,28]]);line([[-40,25],[-14,12]]);
      ctx.setLineDash([4,5]);line([[-14,12],[15,-43]]);line([[-14,12],[42,15]]);break;
    }
    case 27: { // Cylinder.
      ellipse(0,-27,29,11);line([[-29,-27],[-29,28]]);line([[29,-27],[29,28]]);
      ctx.beginPath();ctx.ellipse(0,28,29,11,0,0,Math.PI);ctx.stroke();
      ctx.setLineDash([4,5]);ctx.beginPath();ctx.ellipse(0,28,29,11,0,Math.PI,tau);ctx.stroke();break;
    }
    case 28: { // Fraction with loose pencil strokes.
      text(pick(['a+b','x²','3','dy']),0,-12,26);line([[-34,0],[33,-2]]);text(pick(['c','y','4','dx']),0,32,26);break;
    }
    case 29: { // Infinity, drawn as one curve.
      ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-17,-34,-46,-28,-41,0);ctx.bezierCurveTo(-34,31,-12,24,0,0);ctx.bezierCurveTo(17,-32,46,-28,41,0);ctx.bezierCurveTo(34,31,12,24,0,0);ctx.stroke();break;
    }
    case 30: { // Gear, pleasingly imperfect teeth.
      const points=[];
      for(let i=0;i<48;i++){const a=i*tau/48;const radius=i%4===0||i%4===3?36:29;points.push([Math.cos(a)*radius,Math.sin(a)*radius]);}
      line(points,true);circle(0,0,13);circle(0,0,4);break;
    }
    case 31: { // Small telescope on its tripod.
      line([[-35,-14],[-20,-34],[32,0],[21,17]],true);line([[-29,-11],[-39,-18],[-24,-40],[-15,-33]]);
      line([[22,15],[34,22],[41,10],[31,2]]);line([[1,3],[1,19],[-25,42]]);line([[1,19],[28,41]]);line([[1,19],[1,42]]);break;
    }
    case 32: { // Test tube with bubbles.
      ctx.beginPath();ctx.moveTo(-12,-39);ctx.lineTo(-12,26);ctx.bezierCurveTo(-12,48,15,47,15,26);ctx.lineTo(15,-39);ctx.stroke();
      line([[-17,-40],[20,-40]]);line([[-10,7],[13,7]]);circle(-3,23,3);circle(7,-9,3.5);circle(-7,-23,2.5);break;
    }
    case 33: { // Chemistry flask.
      ctx.beginPath();ctx.moveTo(-12,-36);ctx.lineTo(-12,-7);ctx.lineTo(-34,29);ctx.quadraticCurveTo(-37,38,-26,39);ctx.lineTo(29,39);ctx.quadraticCurveTo(39,38,34,29);ctx.lineTo(13,-7);ctx.lineTo(13,-36);ctx.stroke();
      line([[-17,-38],[18,-38]]);line([[-24,17],[25,17]]);circle(-8,27,3);circle(12,29,4);circle(1,-17,2.5);break;
    }
    case 34: { // Clock, the hands vary.
      circle(0,0,37);circle(0,0,3);
      for(let i=0;i<12;i++){const a=i*tau/12;line([[Math.sin(a)*30,-Math.cos(a)*30],[Math.sin(a)*34,-Math.cos(a)*34]]);}
      const hour=(v%8+1)*tau/12;line([[0,-25],[0,0],[Math.sin(hour)*20,-Math.cos(hour)*20]]);break;
    }
    case 35: { // Percent sign and tiny accents.
      line([[-26,34],[27,-35]]);ellipse(-20,-23,11,15,.2);ellipse(21,23,11,15,.2);
      line([[-42,3],[-37,6]]);line([[36,-2],[43,1]]);break;
    }
    case 36: { // Braces/set notation.
      ctx.beginPath();ctx.moveTo(-24,-39);ctx.bezierCurveTo(-46,-39,-23,-8,-40,0);ctx.bezierCurveTo(-24,8,-46,39,-24,39);ctx.stroke();
      ctx.beginPath();ctx.moveTo(24,-39);ctx.bezierCurveTo(46,-39,23,-8,40,0);ctx.bezierCurveTo(24,8,46,39,24,39);ctx.stroke();
      text(pick(['1,2','x,y','a,b','∅']),0,8,22);break;
    }
    case 37: { // Bent paperclip.
      ctx.beginPath();ctx.moveTo(10,-20);ctx.lineTo(-14,24);ctx.bezierCurveTo(-24,42,-46,28,-33,8);ctx.lineTo(-2,-42);ctx.bezierCurveTo(15,-63,47,-40,30,-15);ctx.lineTo(0,33);ctx.bezierCurveTo(-7,47,-22,36,-15,24);ctx.lineTo(14,-22);ctx.stroke();break;
    }
    case 38: { // Microscope, a little wonky.
      line([[-10,-39],[7,-44],[18,-22],[1,-15]],true);line([[4,-14],[-6,-2],[2,5],[13,-7]]);
      ctx.beginPath();ctx.moveTo(17,-15);ctx.bezierCurveTo(44,7,21,31,0,31);ctx.stroke();
      line([[-27,10],[11,10]]);line([[-20,17],[1,17]]);line([[-4,31],[-4,38]]);line([[-31,39],[31,39],[24,32],[-23,32]],true);circle(20,8,4);break;
    }
    case 39: { // Uneven histogram with an upward pencil arrow.
      line([[-41,33],[41,33]]);
      const heights=[19+(v%3)*4,34,27+(v%2)*5,51];
      heights.forEach((h,i)=>{const x=-32+i*18;line([[x,31],[x,31-h],[x+10,31-h],[x+10,31]]);});
      arrow(-30,-6,31,-39);break;
    }
  }
  ctx.restore();
}

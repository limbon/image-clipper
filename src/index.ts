const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const CANVAS_SIZE = 640;
const DEBUG_COLOR = "#ff00ff";

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

function createLoop(fn: (...args: any[]) => any) {
  const run = () => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    fn();
    window.requestAnimationFrame(run);
  };
  return { run };
}

function main() {
  ctx.fillStyle = DEBUG_COLOR;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

main();

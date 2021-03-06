import "./style.css";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const CANVAS_SIZE = 512;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
canvas.style.width = `${CANVAS_SIZE}px`;
canvas.style.height = `${CANVAS_SIZE}px`;

interface ImageFile {
  value: HTMLImageElement;
  name: string;
}

function createLoop(fn: (...args: any[]) => any) {
  const run = () => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    fn();
    window.requestAnimationFrame(run);
  };
  return { run };
}

function distance(coord1: [number, number], coord2: [number, number]) {
  return Math.sqrt(
    Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2)
  );
}

function drawHandles(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  size: number
) {
  const width = distance([x1, y1], [x2, y1]);
  const height = distance([x2, y1], [x2, y2]);

  ctx.fillStyle = "rgba(255, 255, 255, 0.33)";

  if (x1 > x2 && y1 > y2) {
    ctx.fillRect(x2, y2, width, height);
  } else if (x1 > x2) {
    ctx.fillRect(x2, y1, width, height);
  } else if (y1 > y2) {
    ctx.fillRect(x1, y2, width, height);
  } else {
    ctx.fillRect(x1, y1, width, height);
  }

  ctx.fillStyle = "aqua";

  ctx.fillRect(x1 - size / 2, y1 - size / 2, size, size);
  ctx.fillRect(x2 - size / 2, y1 - size / 2, size, size);
  ctx.fillRect(x2 - size / 2, y2 - size / 2, size, size);
  ctx.fillRect(x1 - size / 2, y2 - size / 2, size, size);
}

function main() {
  const input = document.querySelector("input");
  const clipButton = document.querySelector("button");

  clipButton!.style.display = "none";

  let image: ImageFile | null = null;

  let x1 = 12;
  let x2 = CANVAS_SIZE - 12;
  let y1 = 12;
  let y2 = CANVAS_SIZE - 12;
  const size = 12;

  clipButton?.addEventListener("click", () => {
    if (image) {
      const width = distance([x1, y1], [x2, y1]);
      const height = distance([x2, y1], [x2, y2]);
      const cvs = document.createElement("canvas");
      cvs.width = CANVAS_SIZE;
      cvs.height = CANVAS_SIZE;
      cvs
        .getContext("2d")
        ?.drawImage(
          image.value,
          0,
          0,
          image.value.width,
          image.value.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      let data: ImageData;

      if (x1 > x2 && y1 > y2) {
        data = cvs.getContext("2d")!.getImageData(x2, y2, width, height);
      } else if (x1 > x2) {
        data = cvs.getContext("2d")!.getImageData(x2, y1, width, height);
      } else if (y1 > y2) {
        data = cvs.getContext("2d")!.getImageData(x1, y2, width, height);
      } else {
        data = cvs.getContext("2d")!.getImageData(x1, y1, width, height);
      }

      cvs.getContext("2d")?.clearRect(0, 0, cvs.width, cvs.height);
      cvs.width = width;
      cvs.height = height;
      cvs.getContext("2d")?.putImageData(data, 0, 0);
      const url = cvs.toDataURL();
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const link = document.createElement("a");
        link.download = image!.name;
        link.href = url;
        link.click();
      };
    }
  });

  input?.addEventListener("change", (ev) => {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (ev) => {
        const img = new Image();
        img.src = ev.target?.result as string;
        image = {
          value: img,
          name: file.name,
        };
        clipButton!.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });

  let activeHandle: number = 0;

  canvas.addEventListener("mousedown", (ev) => {
    const { x, y } = canvas.getBoundingClientRect();
    const mouseX = ev.clientX - x;
    const mouseY = ev.clientY - y;

    if (
      mouseX >= x1 - size / 2 &&
      mouseX <= x1 + size / 2 &&
      mouseY >= y1 - size / 2 &&
      mouseY <= y1 + size / 2
    ) {
      if (!activeHandle) {
        activeHandle = 1;
        return;
      }
    }

    if (
      mouseX >= x2 - size / 2 &&
      mouseX <= x2 + size / 2 &&
      mouseY >= y1 - size / 2 &&
      mouseY <= y1 + size / 2
    ) {
      if (!activeHandle) {
        activeHandle = 2;
        return;
      }
    }

    if (
      mouseX >= x1 - size / 2 &&
      mouseX <= x1 + size / 2 &&
      mouseY >= y2 - size / 2 &&
      mouseY <= y2 + size / 2
    ) {
      if (!activeHandle) {
        activeHandle = 3;
        return;
      }
    }

    if (
      mouseX >= x2 - size / 2 &&
      mouseX <= x2 + size / 2 &&
      mouseY >= y2 - size / 2 &&
      mouseY <= y2 + size / 2
    ) {
      if (!activeHandle) {
        activeHandle = 4;
        return;
      }
    }
  });

  document.addEventListener("mousemove", (ev) => {
    const { x, y } = canvas.getBoundingClientRect();
    const mouseX = ev.clientX - x;
    const mouseY = ev.clientY - y;
    if (activeHandle === 1) {
      x1 = mouseX;
      y1 = mouseY;
      return;
    }
    if (activeHandle === 2) {
      x2 = mouseX;
      y1 = mouseY;
      return;
    }

    if (activeHandle === 3) {
      x1 = mouseX;
      y2 = mouseY;
      return;
    }
    if (activeHandle === 4) {
      x2 = mouseX;
      y2 = mouseY;
      return;
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (activeHandle) {
      activeHandle = 0;
    }
  });

  createLoop(() => {
    if (image) {
      ctx.drawImage(
        image.value,
        0,
        0,
        image.value.width,
        image.value.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      drawHandles(x1, x2, y1, y2, size);
    }
  }).run();
}

main();

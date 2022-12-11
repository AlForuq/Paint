const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill_color"),
  sizeSlider = document.querySelector("#size_slider"),
  colors = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color_picker");
clearCanvasBtn = document.querySelector(".clear");
saveCanvasBtn = document.querySelector(".save");

let ctx = canvas.getContext("2d"),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#4a98f7",
  prevMouseX,
  prevMouseY,
  snapShot;

// set a background on canvas painting downloaded image
const setCanvasBg = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBg();
});

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stoptDrawing);
function drawing(e) {
  if (isDrawing) {
    ctx.putImageData(snapShot, 0, 0);
    switch (selectedTool) {
      case "rectangle":
        drawingRectangle(e);
        break;
      case "circle":
        drawingCircle(e);
        break;
      case "triangle":
        drawingTriangle(e);
        break;
      case "straight":
        drawingStraight(e);
        break;
      case "brush":
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        break;
      case "eraser":
        ctx.strokeStyle = "#fff";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        break;
    }
  }
}

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;

  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;

  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;

  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function stoptDrawing() {
  isDrawing = false;
}

//CASES
function drawingRectangle(e) {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  } else {
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
}

function drawingCircle(e) {
  ctx.beginPath();
  const radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );

  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawingTriangle(e) {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawingStraight(e) {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

//Making selected button visible  AND switch cases by changing "selectedTool"
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTool = btn.id;
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
  });
});

//SIZE SLIDER
sizeSlider.addEventListener("change", (e) => {
  brushWidth = sizeSlider.value;
  //   brushWidth = e.target.value;
});

//Part1) Making selected color visible AND Pat2) change color by changing "selectedColor"
colors.forEach((btn) => {
  btn.addEventListener("click", () => {
    //Part1)
    document
      .querySelector(".colors .option.selected")
      .classList.remove("selected");
    btn.classList.add("selected");

    //Pat2)
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

//ColorPicker
colorPicker.addEventListener("change", (e) => {
  colorPicker.parentElement.style.background = e.target.value;
  selectedColor = colorPicker; //or e.target.value instead of "colorPicker"
  //   colorPicker.parentElement.click();
});

//clear
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

//save
saveCanvasBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `My paint_${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  setCanvasBg();
  link.click();
});

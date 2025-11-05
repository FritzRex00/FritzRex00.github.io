let penEnabled = false;
let penColor = "#000";
let penWidth = 2;
let drawing = false;
let activeCtx = null;
let pagesContainer = null;
let lastFocusedEditor = null;
let savedRange = null;

// Initialize editor
function initEditor() {
  const cur = requireAuth?.() || { name: "Guest" };
  document.getElementById("userName").textContent = cur.name || "Guest";
  pagesContainer = document.getElementById("pagesContainer");
  addNewPage();
}

// Add a new A4 page
function addNewPage() {
  const page = document.createElement("div");
  page.className = "page";
  pagesContainer.appendChild(page);

  const editor = document.createElement("div");
  editor.className = "editor";
  editor.contentEditable = true;
  page.appendChild(editor);

  const canvas = document.createElement("canvas");
  canvas.className = "penCanvas";
  page.appendChild(canvas);

  // Must wait for layout
  requestAnimationFrame(() => resizeCanvas(canvas, page));

  setupPageEvents(editor, canvas);
  editor.focus();
  lastFocusedEditor = editor;
  return page;
}

// Resize canvas to match page
function resizeCanvas(canvas, page) {
  canvas.width = page.clientWidth;
  canvas.height = page.clientHeight;
  canvas.style.pointerEvents = penEnabled ? "auto" : "none";
}

// Setup editor and canvas behavior
function setupPageEvents(editor, canvas) {
  editor.addEventListener("focus", () => {
    lastFocusedEditor = editor;
    saveSelection();
  });
  editor.addEventListener("keyup", saveSelection);
  editor.addEventListener("mouseup", saveSelection);

  // Pen drawing events
  canvas.addEventListener("mousedown", e => {
    if (!penEnabled) return;
    drawing = true;
    activeCtx = canvas.getContext("2d");
    activeCtx.strokeStyle = penColor;
    activeCtx.lineWidth = penWidth;
    activeCtx.lineCap = "round";
    activeCtx.beginPath();
    activeCtx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", e => {
    if (!drawing || !activeCtx) return;
    activeCtx.lineTo(e.offsetX, e.offsetY);
    activeCtx.stroke();
  });

  window.addEventListener("mouseup", () => {
    drawing = false;
    activeCtx = null;
  });

  // Add new page when overflow
  editor.addEventListener("input", () => {
    if (editor.scrollHeight > editor.clientHeight) {
      const page = addNewPage();
      const newEditor = page.querySelector(".editor");
      while (editor.scrollHeight > editor.clientHeight && editor.lastChild) {
        newEditor.insertBefore(editor.lastChild, newEditor.firstChild);
      }
      newEditor.focus();
    }
  });
}

// Save and restore selection
function saveSelection() {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) savedRange = sel.getRangeAt(0);
}
function restoreSelection() {
  if (!savedRange) return;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(savedRange);
}

// Toolbar Commands
function execCmd(command, value = null) {
  if (!lastFocusedEditor) {
    alert("Click inside a page first.");
    return;
  }
  lastFocusedEditor.focus();
  restoreSelection();
  document.execCommand(command, false, value);
  saveSelection();
}

// Insert image
function insertImage() {
  if (!lastFocusedEditor) {
    alert("Click inside a page before inserting an image.");
    return;
  }

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      restoreSelection();
      document.execCommand("insertImage", false, e.target.result);
    };
    reader.readAsDataURL(file);
  };
}

// Toggle Pen
function togglePen() {
  penEnabled = !penEnabled;
  const btn = document.getElementById("penToggle");
  btn.classList.toggle("active", penEnabled);

  document.querySelectorAll(".page").forEach(page => {
    const canvas = page.querySelector(".penCanvas");
    resizeCanvas(canvas, page);
  });
}

// Pen options
function setPenColor(input) {
  penColor = input.value;
}
function setPenWidth(input) {
  penWidth = parseInt(input.value) || 2;
}

// Save & Share
function saveNote() {
  const pages = document.querySelectorAll(".page");
  const data = [];
  pages.forEach(page => {
    const editor = page.querySelector(".editor");
    const canvas = page.querySelector(".penCanvas");
    data.push({ content: editor.innerHTML, canvas: canvas.toDataURL() });
  });

  const notes = JSON.parse(localStorage.getItem("auric_notes") || "[]");
  notes.unshift({
    pages: data,
    owner: JSON.parse(localStorage.getItem("auric_current") || "{}"),
    created: Date.now()
  });
  localStorage.setItem("auric_notes", JSON.s_

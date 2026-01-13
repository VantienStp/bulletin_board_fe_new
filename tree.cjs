const fs = require("fs");
const path = require("path");

const ignoreDirs = ["node_modules", ".git", "dist", "build", ".next", ".vscode", "coverage", "out"];

function showFolders(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.isDirectory()) {
      if (ignoreDirs.includes(item.name)) continue;
      console.log(prefix + "📁 " + item.name);
      showFolders(path.join(dir, item.name), prefix + "   ");
    }
  }
}

function showFoldersAndFiles(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const subPrefix = isLast ? "    " : "│   ";

    if (item.isDirectory()) {
      if (ignoreDirs.includes(item.name)) continue;
      console.log(prefix + connector + "📁 " + item.name);
      showFoldersAndFiles(path.join(dir, item.name), prefix + subPrefix);
    } else {
      console.log(prefix + connector + "📄 " + item.name);
    }
  }
}

const startDir = process.argv[2] || "./";
const mode = process.argv[3] || "both";

// 🔄 Ghi kết quả vào file
const originalConsoleLog = console.log;
const output = [];
console.log = (...args) => output.push(args.join(" "));

if (mode === "folders") {
  showFolders(startDir);
} else {
  showFoldersAndFiles(startDir);
}

console.log = originalConsoleLog;
fs.writeFileSync("tree.txt", output.join("\n"), "utf8");

console.log(`✅ Đã tạo cây thư mục (${mode === "folders" ? "chỉ thư mục" : "thư mục + file"}) trong tree.txt`);

import 'dotenv/config';
import chokidar from 'chokidar';
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from "postcss";
import autoprefixer from "autoprefixer";

const dirType = 'app';
const env = process.env, assetsFolder = 'assets';
const rootDir = path.join(process.cwd(), dirType);


const {
  STYLESHEET_FILE = 'default',
  SCRIPT_FILE = 'default',
} = env;

export function getFile(filePath) {
  let fileExtension = path.extname(filePath);
  let fileType = fileExtension == '.scss' ? 'style' : 'script';
  let fileName = path.basename(filePath, fileExtension);
  let fileFullName = path.basename(filePath);
  let isMinify = fileFullName.includes('.min.');

  return {
    fileName,
    fileFullName,
    fileExtension,
    fileType,
    isMinify
  }
}

// #region [Build file]
async function buildTask(entryPoints) {

  if (entryPoints && typeof entryPoints === "string") {
    entryPoints = [entryPoints];
  }

  if (!entryPoints.length) return;

  let { fileExtension, fileType, fileName, isMinify = false } = getFile(entryPoints[0]);
  let entryOnlyMinify = [];
  let plugins = [];
  let result;
  let minify = isMinify ? isMinify : SCRIPT_FILE == 'minify';
  let buildFiles = entryPoints.map(i => path.basename(i)).join(', ');

  if (fileType == 'style') {
    minify = isMinify ? isMinify : STYLESHEET_FILE == 'minify';

    plugins = [
      sassPlugin({ outputStyle: minify ? "compressed" : "expanded" }),
      {
        name: 'postcss',
        setup(build) {
          build.onLoad({ filter: /\.css$/ }, async (args) => {
            const content = await fs.readFile(args.path, 'utf8');
            const result = await postcss([autoprefixer]).process(content, {
              from: args.path,
              to: args.path,
            });
            return { contents: result.css, loader: 'css' };
          });
        },
      },
    ]
  }

  /* Normal file version */
  result = await esbuild.build({
    entryPoints,
    bundle: true,
    minify,
    legalComments: "inline",
    outdir: path.resolve(process.cwd(), "./", assetsFolder),
    plugins
  });

  if (result.errors.length) {
    console.error('>>> Error: ' + result.error[0]);
    return;
  }

  logWithColor(">>> Finished: " + buildFiles, '', 'green');
  return;
}
// #endregion


// #region [Remove file]
async function removeTask(filePath) {
  let { fileExtension, fileType, fileFullName } = getFile(filePath);
  const fileToDelete = assetsFolder + "/" + fileFullName.replace('scss', 'css');

  console.log('removeTask :>> ', fileToDelete);

  if (!fs.existsSync(fileToDelete)) {
    logWithColor(">>>> Deleted: File " + fileFullName, ' already deleted', 'red');
    return;
  }

  try {
    fs.unlinkSync(fileToDelete);
    logWithColor(">>>> Deleted: " + fileFullName, '', 'red');
  } catch (error) {
    console.error(`Error deleting file: ${fileToDelete}`, error);
  }
}
// #endregion


// #region [Start]
async function startServer() {

  const glob = '**/*.(js|scss)'
  const watcher = chokidar.watch(path.join(rootDir, glob), { ignored: /^\./, persistent: true });
  watcher.on('change', (filePath) => {
    findFilesWithImport(filePath);
  });
  const rootGlob = '*/*.(js|scss)'
  const rootWatcher = chokidar.watch(path.join(rootDir, rootGlob), { ignoreInitial: true })

  rootWatcher.on('add', buildTask)
  rootWatcher.on('unlink', removeTask);

  logWithColor("[Theme Build] Running...", '', 'green');
}
startServer();
// #endregion


function existsCaseSensitive(filePath) {
  if (!fs.existsSync(filePath)) return false;

  const dir = path.dirname(filePath);
  const { fileFullName: fileName } = getFile(filePath);

  const files = fs.readdirSync(dir);

  return files.includes(fileName);
}

// #region [Scan file]
function isFileInDirectory(file, dirPath = rootDir,) {
  const { fileFullName: fileName, fileType: _fileType } = getFile(file);
  const fileType = _fileType == 'script' ? 'scripts' : 'styles';
  const filePath = path.join(`${dirPath}/${fileType}`, fileName);

  if (existsCaseSensitive(filePath)) {
    return true;
  } else {
    return false;
  }
}

function processFile(filePath, fileChange) {
  const { fileType: fileChangeType } = getFile(fileChange);
  const { fileFullName: fileName, fileType } = getFile(filePath);

  if (fileType != fileChangeType) return;

  logWithColor('>>> Proccessing: ' + fileName, '', '');

  buildTask(filePath)
}

function findFilesWithImport(originFilePath) {
  const changedFile = path.relative(rootDir, originFilePath);
  const { fileName: fileNameWithoutExtension } = getFile(changedFile);

  if (isFileInDirectory(changedFile)) {
    processFile(originFilePath, changedFile);
    return {
      ok: true
    };
  }
  searchImports(rootDir);

  function searchImports(dir) {

    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error('Error:', err);
        return {
          oke: false,
          msg: err
        };
      }

      files.forEach((file) => {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
          searchImports(filePath);
        } else if (file.isFile() && /\.(js|ts|jsx|tsx|scss)$/.test(file.name)) {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error:', err);
              return {
                oke: false,
                msg: err
              };
            }

            const importPattern = new RegExp(`\/${fileNameWithoutExtension}[.'"]`);
            if (importPattern.test(data)) {
              isFileInDirectory(filePath) ? processFile(filePath, changedFile) : findFilesWithImport(filePath);
            }
          });
        }
      });
    });
  }
}
// #endregion

function logWithColor(msg, textColor = 'default', bgColor = 'transparent') {

  const colors = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    default: 39
  };

  const bgColors = {
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    magenta: 45,
    cyan: 46,
    white: 47,
    transparent: 49
  };
  const textColorCode = colors[textColor.toLowerCase()] || colors.default;
  const bgColorCode = bgColors[bgColor.toLowerCase()] || bgColors.transparent;
  console.log(`\x1b[${bgColorCode}m\x1b[${textColorCode}m${msg}\x1b[0m`);
}
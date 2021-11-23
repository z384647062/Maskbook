var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.isGitIgnoredSync = exports.isGitIgnored = void 0
const node_util_1 = require('util')
const node_fs_1 = __importDefault(require('fs'))
const node_path_1 = __importDefault(require('path'))
const fast_glob_1 = __importDefault(require('../../../../node_modules/.pnpm/globby@12.0.2/node_modules/fast-glob'))
const ignore_1 = __importDefault(require('../../../../node_modules/.pnpm/globby@12.0.2/node_modules/ignore'))
const slash_1 = function slash(path) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path)
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path) // eslint-disable-line no-control-regex

    if (isExtendedLengthPath || hasNonAscii) {
        return path
    }

    return path.replace(/\\/g, '/')
}

const DEFAULT_IGNORE = ['**/node_modules/**', '**/flow-typed/**', '**/coverage/**', '**/.git']
const readFileP = (0, node_util_1.promisify)(node_fs_1.default.readFile)
const mapGitIgnorePatternTo = (base) => (ignore) => {
    if (ignore.startsWith('!')) {
        return '!' + node_path_1.default.posix.join(base, ignore.slice(1))
    }
    return node_path_1.default.posix.join(base, ignore)
}
const parseGitIgnore = (content, options) => {
    const base = (0, slash_1.default)(
        node_path_1.default.relative(options.cwd, node_path_1.default.dirname(options.fileName)),
    )
    return content
        .split(/\r?\n/)
        .filter(Boolean)
        .filter((line) => !line.startsWith('#'))
        .map(mapGitIgnorePatternTo(base))
}
const reduceIgnore = (files) => {
    const ignores = (0, ignore_1.default)()
    for (const file of files) {
        ignores.add(
            parseGitIgnore(file.content, {
                cwd: file.cwd,
                fileName: file.filePath,
            }),
        )
    }
    return ignores
}
const ensureAbsolutePathForCwd = (cwd, p) => {
    cwd = (0, slash_1.default)(cwd)
    if (node_path_1.default.isAbsolute(p)) {
        if ((0, slash_1.default)(p).startsWith(cwd)) {
            return p
        }
        throw new Error(`Path ${p} is not in cwd ${cwd}`)
    }
    return node_path_1.default.join(cwd, p)
}
const getIsIgnoredPredicate = (ignores, cwd) => (p) =>
    ignores.ignores((0, slash_1.default)(node_path_1.default.relative(cwd, ensureAbsolutePathForCwd(cwd, p.path || p))))
const getFile = async (file, cwd) => {
    const filePath = node_path_1.default.join(cwd, file)
    const content = await readFileP(filePath, 'utf8')
    return {
        cwd,
        filePath,
        content,
    }
}
const getFileSync = (file, cwd) => {
    const filePath = node_path_1.default.join(cwd, file)
    const content = node_fs_1.default.readFileSync(filePath, 'utf8')
    return {
        cwd,
        filePath,
        content,
    }
}
const normalizeOptions = ({ ignore = [], cwd = (0, slash_1.default)(process.cwd()) } = {}) => ({ ignore, cwd })
const isGitIgnored = async (options) => {
    options = normalizeOptions(options)
    const paths = await (0, fast_glob_1.default)('**/.gitignore', {
        ignore: DEFAULT_IGNORE.concat(options.ignore),
        cwd: options.cwd,
    })
    const files = await Promise.all(paths.map((file) => getFile(file, options.cwd)))
    const ignores = reduceIgnore(files)
    return getIsIgnoredPredicate(ignores, options.cwd)
}
exports.isGitIgnored = isGitIgnored
const isGitIgnoredSync = (options) => {
    options = normalizeOptions(options)
    const paths = fast_glob_1.default.sync('**/.gitignore', {
        ignore: DEFAULT_IGNORE.concat(options.ignore),
        cwd: options.cwd,
    })
    const files = paths.map((file) => getFileSync(file, options.cwd))
    const ignores = reduceIgnore(files)
    return getIsIgnoredPredicate(ignores, options.cwd)
}
exports.isGitIgnoredSync = isGitIgnoredSync

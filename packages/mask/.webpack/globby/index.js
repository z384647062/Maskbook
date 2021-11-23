var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.isGitIgnoredSync =
    exports.isGitIgnored =
    exports.isDynamicPattern =
    exports.globbyStream =
    exports.globbySync =
    exports.globby =
    exports.generateGlobTasks =
        void 0
const node_fs_1 = __importDefault(require('fs'))
const array_union_1 = { default: (...arguments_) => [...new Set(arguments_.flat())] }
const merge2_1 = __importDefault(require('../../../../node_modules/.pnpm/globby@12.0.2/node_modules/merge2'))
const fast_glob_1 = __importDefault(require('../../../../node_modules/.pnpm/globby@12.0.2/node_modules/fast-glob'))
const dir_glob_1 = __importDefault(require('../../../../node_modules/.pnpm/globby@12.0.2/node_modules/dir-glob'))
const gitignore_js_1 = require('./gitignore.js')
const stream_utils_js_1 = require('./stream-utils.js')
const DEFAULT_FILTER = () => false
const isNegative = (pattern) => pattern[0] === '!'
const assertPatternsInput = (patterns) => {
    if (!patterns.every((pattern) => typeof pattern === 'string')) {
        throw new TypeError('Patterns must be a string or an array of strings')
    }
}
const checkCwdOption = (options = {}) => {
    if (!options.cwd) {
        return
    }
    let stat
    try {
        stat = node_fs_1.default.statSync(options.cwd)
    } catch {
        return
    }
    if (!stat.isDirectory()) {
        throw new Error('The `cwd` option must be a path to a directory')
    }
}
const getPathString = (p) => (p.stats instanceof node_fs_1.default.Stats ? p.path : p)
const generateGlobTasks = (patterns, taskOptions) => {
    patterns = (0, array_union_1.default)([patterns].flat())
    assertPatternsInput(patterns)
    checkCwdOption(taskOptions)
    const globTasks = []
    taskOptions = {
        ignore: [],
        expandDirectories: true,
        ...taskOptions,
    }
    for (const [index, pattern] of patterns.entries()) {
        if (isNegative(pattern)) {
            continue
        }
        const ignore = patterns
            .slice(index)
            .filter((pattern) => isNegative(pattern))
            .map((pattern) => pattern.slice(1))
        const options = {
            ...taskOptions,
            ignore: [...taskOptions.ignore, ...ignore],
        }
        globTasks.push({ pattern, options })
    }
    return globTasks
}
exports.generateGlobTasks = generateGlobTasks
const globDirectories = (task, fn) => {
    let options = {}
    if (task.options.cwd) {
        options.cwd = task.options.cwd
    }
    if (Array.isArray(task.options.expandDirectories)) {
        options = {
            ...options,
            files: task.options.expandDirectories,
        }
    } else if (typeof task.options.expandDirectories === 'object') {
        options = {
            ...options,
            ...task.options.expandDirectories,
        }
    }
    return fn(task.pattern, options)
}
const getPattern = (task, fn) => (task.options.expandDirectories ? globDirectories(task, fn) : [task.pattern])
const getFilterSync = (options) =>
    options && options.gitignore
        ? (0, gitignore_js_1.isGitIgnoredSync)({ cwd: options.cwd, ignore: options.ignore })
        : DEFAULT_FILTER
const globToTask = (task) => async (glob) => {
    const { options } = task
    if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
        options.ignore = await (0, dir_glob_1.default)(options.ignore)
    }
    return {
        pattern: glob,
        options,
    }
}
const globToTaskSync = (task) => (glob) => {
    const { options } = task
    if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
        options.ignore = dir_glob_1.default.sync(options.ignore)
    }
    return {
        pattern: glob,
        options,
    }
}
const globby = async (patterns, options) => {
    const globTasks = (0, exports.generateGlobTasks)(patterns, options)
    const getFilter = async () =>
        options && options.gitignore
            ? (0, gitignore_js_1.isGitIgnored)({ cwd: options.cwd, ignore: options.ignore })
            : DEFAULT_FILTER
    const getTasks = async () => {
        const tasks = await Promise.all(
            globTasks.map(async (task) => {
                const globs = await getPattern(task, dir_glob_1.default)
                return Promise.all(globs.map(globToTask(task)))
            }),
        )
        return (0, array_union_1.default)(...tasks)
    }
    const [filter, tasks] = await Promise.all([getFilter(), getTasks()])
    const paths = await Promise.all(tasks.map((task) => (0, fast_glob_1.default)(task.pattern, task.options)))
    return (0, array_union_1.default)(...paths).filter((path_) => !filter(getPathString(path_)))
}
exports.globby = globby
const globbySync = (patterns, options) => {
    const globTasks = (0, exports.generateGlobTasks)(patterns, options)
    const tasks = []
    for (const task of globTasks) {
        const newTask = getPattern(task, dir_glob_1.default.sync).map(globToTaskSync(task))
        tasks.push(...newTask)
    }
    const filter = getFilterSync(options)
    let matches = []
    for (const task of tasks) {
        matches = (0, array_union_1.default)(matches, fast_glob_1.default.sync(task.pattern, task.options))
    }
    return matches.filter((path_) => !filter(path_))
}
exports.globbySync = globbySync
const globbyStream = (patterns, options) => {
    const globTasks = (0, exports.generateGlobTasks)(patterns, options)
    const tasks = []
    for (const task of globTasks) {
        const newTask = getPattern(task, dir_glob_1.default.sync).map(globToTaskSync(task))
        tasks.push(...newTask)
    }
    const filter = getFilterSync(options)
    const filterStream = new stream_utils_js_1.FilterStream((p) => !filter(p))
    const uniqueStream = new stream_utils_js_1.UniqueStream()
    return (0, merge2_1.default)(tasks.map((task) => fast_glob_1.default.stream(task.pattern, task.options)))
        .pipe(filterStream)
        .pipe(uniqueStream)
}
exports.globbyStream = globbyStream
const isDynamicPattern = (patterns, options) =>
    [patterns].flat().some((pattern) => fast_glob_1.default.isDynamicPattern(pattern, options))
exports.isDynamicPattern = isDynamicPattern
var gitignore_js_2 = require('./gitignore.js')
Object.defineProperty(exports, 'isGitIgnored', {
    enumerable: true,
    get: function () {
        return gitignore_js_2.isGitIgnored
    },
})
Object.defineProperty(exports, 'isGitIgnoredSync', {
    enumerable: true,
    get: function () {
        return gitignore_js_2.isGitIgnoredSync
    },
})

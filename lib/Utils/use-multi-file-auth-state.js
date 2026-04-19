"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiFileAuthState = void 0;
const async_mutex_1 = require("async-mutex");
const promises_1 = require("fs/promises");
const { rename } = require("fs/promises");
const path_1 = require("path");
const WAProto_1 = require("../../WAProto");
const auth_utils_1 = require("./auth-utils");
const generics_1 = require("./generics");
const fileLocks = new Map();
const getFileLock = (path) => {
    let mutex = fileLocks.get(path);
    if (!mutex) {
        mutex = new async_mutex_1.Mutex();
        fileLocks.set(path, mutex);
    }
    return mutex;
};
/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * 
 * Enhanced with:
 * - Atomic writes (write to temp file, then rename) to prevent session corruption
 * - Session backup for creds.json to allow recovery from bad sessions
 * - Improved error handling and data validation
 * */
const useMultiFileAuthState = async (folder) => {
    const fixFileName = (file) => { var _a; return (_a = file === null || file === void 0 ? void 0 : file.replace(/\//g, '__')) === null || _a === void 0 ? void 0 : _a.replace(/:/g, '-'); };

    /** Atomic write: write to temp file first, then rename to avoid corruption */
    const writeData = async (data, file) => {
        const filePath = (0, path_1.join)(folder, fixFileName(file));
        const tempPath = filePath + '.tmp';
        const mutex = getFileLock(filePath);
        return mutex.acquire().then(async (release) => {
            try {
                const serialized = JSON.stringify(data, generics_1.BufferJSON.replacer);
                // Write to temp file first, then atomic rename
                await (0, promises_1.writeFile)(tempPath, serialized);
                await rename(tempPath, filePath);
            }
            catch (err) {
                // cleanup temp file on error
                try { await (0, promises_1.unlink)(tempPath); } catch (_e) {}
                throw err;
            }
            finally {
                release();
            }
        });
    };

    /** Write creds with backup to prevent total session loss */
    const writeCredsWithBackup = async (data) => {
        const filePath = (0, path_1.join)(folder, 'creds.json');
        const backupPath = (0, path_1.join)(folder, 'creds.json.bak');
        const tempPath = filePath + '.tmp';
        const mutex = getFileLock(filePath);
        return mutex.acquire().then(async (release) => {
            try {
                const serialized = JSON.stringify(data, generics_1.BufferJSON.replacer);
                // backup existing creds before overwriting
                try {
                    const existing = await (0, promises_1.readFile)(filePath);
                    await (0, promises_1.writeFile)(backupPath, existing);
                }
                catch (_e) {}
                // atomic write
                await (0, promises_1.writeFile)(tempPath, serialized);
                await rename(tempPath, filePath);
            }
            catch (err) {
                try { await (0, promises_1.unlink)(tempPath); } catch (_e) {}
                throw err;
            }
            finally {
                release();
            }
        });
    };

    const readData = async (file) => {
        try {
            const filePath = (0, path_1.join)(folder, fixFileName(file));
            const mutex = getFileLock(filePath);
            return await mutex.acquire().then(async (release) => {
                try {
                    const data = await (0, promises_1.readFile)(filePath, { encoding: 'utf-8' });
                    // validate JSON before returning
                    if (!data || !data.trim()) return null;
                    return JSON.parse(data, generics_1.BufferJSON.reviver);
                }
                catch (parseErr) {
                    // if JSON parse fails, try backup for creds
                    if (file === 'creds.json') {
                        try {
                            const backupPath = (0, path_1.join)(folder, 'creds.json.bak');
                            const backup = await (0, promises_1.readFile)(backupPath, { encoding: 'utf-8' });
                            if (backup && backup.trim()) {
                                return JSON.parse(backup, generics_1.BufferJSON.reviver);
                            }
                        }
                        catch (_e) {}
                    }
                    return null;
                }
                finally {
                    release();
                }
            });
        }
        catch (error) {
            return null;
        }
    };
    const removeData = async (file) => {
        try {
            const filePath = (0, path_1.join)(folder, fixFileName(file));
            const mutex = getFileLock(filePath);
            return mutex.acquire().then(async (release) => {
                try {
                    await (0, promises_1.unlink)(filePath);
                }
                catch (_a) {
                }
                finally {
                    release();
                }
            });
        }
        catch (_a) {
        }
    };
    const folderInfo = await (0, promises_1.stat)(folder).catch(() => { });
    if (folderInfo) {
        if (!folderInfo.isDirectory()) {
            throw new Error(`found something that is not a directory at ${folder}, either delete it or specify a different location`);
        }
    }
    else {
        await (0, promises_1.mkdir)(folder, { recursive: true });
    }
    const creds = await readData('creds.json') || (0, auth_utils_1.initAuthCreds)();
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}.json`);
                        if (type === 'app-state-sync-key' && value) {
                            value = WAProto_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const file = `${category}-${id}.json`;
                            tasks.push(value ? writeData(value, file) : removeData(file));
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: async () => {
            return writeCredsWithBackup(creds);
        }
    };
};
exports.useMultiFileAuthState = useMultiFileAuthState;

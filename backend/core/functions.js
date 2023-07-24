const fs = require('fs');
const fs_p = require('fs').promises;

/**
 * 
 * @param {*} obj 
 *  obj.path //path of the file to read or write (required)
    obj.action // read/write/delete/custom (Default: read)
    obj.data // data to write to file (Binary)
    obj.override // true by default
 * @returns 
 */
exports.fileHandler = async function fileHandler(obj) {
    // issue if obj too large
    //run function to check size before exec/reading in memory
    if(!obj || !obj.path) return;
    var _obj = obj;
    
    if(!obj.action) _obj.action = 'read';
    if(!obj.override) _obj.override = true;

    try {
        switch(_obj.action) {
            case 'write':
                return await fs.promises.writeFile(obj.path, obj.data);
            break;
            case 'read':
                return await fs.promises.readFile(obj.path, 'utf8')
            break;
            case 'delete':
                return await fs_p.unlink(obj.path);
            default: break;
        }
    } catch (error) {
        console.error(error);
    }
}
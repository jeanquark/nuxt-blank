const fs = require('fs')
const path = require('path')

const calculateFolderSize = async dirPath => {

    console.log('calculateFolderSize called. dirPath: ', dirPath)

    const getAllFiles = function (dirPath, arrayOfFiles) {
        files = fs.readdirSync(dirPath)

        arrayOfFiles = arrayOfFiles || []

        files.forEach(function (file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                arrayOfFiles.push(path.join(dirPath, file))
            }
        })

        return arrayOfFiles
    }

    const getTotalSize = function (directoryPath) {
        const arrayOfFiles = getAllFiles(directoryPath)
        console.log('arrayOfFiles: ', arrayOfFiles)

        let totalSize = 0

        arrayOfFiles.forEach(function (filePath) {
            totalSize += fs.statSync(filePath).size
        })

        return totalSize
    }

    return getTotalSize(dirPath)
}

module.exports = calculateFolderSize

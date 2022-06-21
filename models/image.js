/*
    Name: Ng Jun Han
    Admin: 2008493
    Class: DISM/FT/2B/21
*/

const path = require('path')
const fileTypes = [["JFIF", "jpg"], ["PNG", "png"]]
const maxFileSize = 10000000

const imageCheck = {
    checkFileSize: (file) => {
        if (file.size <= maxFileSize) {
            return true
        }
        return false
    },
    checkFileFormat: (file) => {
        var fileBytes = file.data.toString('utf-8', 0, 16)
        var fileExtension
        fileTypes.forEach((e) => {
            // Check if the fileBytes can be found in the fileTypes array
            let index = fileBytes.indexOf(e[0])
            if (index != -1) {  // If it is, set the fileExtension to the fileType
                fileExtension = e[1]
            }
        })
        return fileExtension
    },
    checkFile: (file, name) => {
        var fileType = imageCheck.checkFileFormat(file)
        console.log(fileType)
        if (fileType && imageCheck.checkFileSize(file)) {
            var fileLocation = path.join('./images/' + file.name)
            var fileNameArr = fileLocation.split(".")
            if (fileNameArr[fileNameArr.length - 1] == fileType) {
                fileNameArr.pop()
                fileNameArr.push(fileType)  // Add the file type to the file name
            }
            // Ensures that each user as its own unique profile picture.
            fileNameArr[fileNameArr.length - 2] = fileNameArr[fileNameArr.length - 2] + "_" + name.replace(" ", "_")
            fileLocation = "./"+ fileNameArr.join(".")
            console.log(fileLocation.replace("\\", "/"))
            file.mv(fileLocation)
            return fileLocation.replace("\\", "/")
        }
    }
}

module.exports = imageCheck
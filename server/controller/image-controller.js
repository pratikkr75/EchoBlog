import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'http://localhost:8000';

let gfs, gridfsBucket;
const conn = mongoose.connection;

try {
    conn.once('open', () => {
        gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'fs'
        });
        gfs = grid(conn.db, mongoose.mongo);
        gfs.collection('fs');
    });
} catch (error) {
    console.error("Error initializing gridfs:", error);
    // Handle the error as per your application's requirements
}


export const uploadImage = (request, response) => {
    try {
        if (!request.file) {
            return response.status(404).send("File not found");
        }

        const imageUrl = `${url}/file/${request.file.filename}`;

        response.status(200).json(imageUrl);
    } catch (error) {
        console.error("Error while uploading image:", error);
        response.status(500).json({ error: "Internal server error" });
        // Handle the error as per your application's requirements
    }
};


export const getImage = async (request, response) => {
    try {
        const file = await gfs.files.findOne({ filename: request.params.filename });
        if (!file) {
            return response.status(404).send("File not found");
        }

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.on('error', (error) => {
            console.error("Error reading stream:", error);
            response.status(500).json({ msg: "Error reading stream" });
            // Handle the error as per your application's requirements
        });

        readStream.pipe(response);
    } catch (error) {
        console.error("Error retrieving image:", error);
        response.status(500).json({ msg: "Internal server error" });
        // Handle the error as per your application's requirements
    }
};

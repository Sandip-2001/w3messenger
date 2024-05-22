import imageCompression from "browser-image-compression";

export const imageCompressor = async ( imgFile ) => {
    console.log("image compressor called")
    console.log(imgFile.size/1024/1024);
    const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 800,
        useWebWorker: true
    };
    let output = await imageCompression(imgFile, options);
    console.log(output.size/1024/1024);
    return output;
};
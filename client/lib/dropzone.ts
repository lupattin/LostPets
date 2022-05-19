import { Dropzone } from "dropzone";

// Configuración de Dropzone
export function dropzoneUpload(uploadImg: Element, uploadButton: Element){
   return new Dropzone(uploadImg, {
      url: `/falsa`,
      autoProcessQueue: false,
      maxFiles: 1,
      clickable: true,
      clickeableElements: uploadImg,
      thumbnailWidth: 200,
      thumbnailHeight: 200
   });
}

/* let pictureImage;
    const dropzoneInit = dropzoneUpload(imageEl, buttonEl);
    
    dropzoneInit.on("addedfile", function(file){
      pictureImage = file.dataURL
      console.log(pictureImage);
      
    }) */
import multer from "multer";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'src/uploads')
    },
    filename:function(req,file,cb){
        const name=Date.now()+'_'+file.originalname;
        cb(null,req.userId+name);
    }
})
export const multerUplaod= multer({storage});

export const singleUpload= multerUplaod.single("profile");
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import multer from 'multer';
import { ApiResponse } from '@/models/ApiResponse';
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage';

interface MulterRequest extends NextApiRequest {
    file: any;
}

const outputFolderName = './public/uploads';

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, outputFolderName)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage })

const apiRoute = nc<MulterRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.single('myResume'));

apiRoute.post(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "Khong co file trong request" })
    }

    console.log(`${process.env.WEB3_STORAGE_API_KEY}`);


    let storageWeb3 = new Web3Storage({ token: `${process.env.WEB3_STORAGE_API_KEY}` });


    const pathFile = await getFilesFromPath(`${outputFolderName}/${file.originalname}`);
    console.log(`${pathFile}`);

    // const filesWeb3 = [];
    // filesWeb3.push(...pathFile);
    // console.log(filesWeb3);

    console.log(`Uploading files`);
    const cid = await storageWeb3.put(pathFile, { name: file.originalname });
    console.log('Content added with CID:', cid);

    res.status(200).send(file);
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
export default apiRoute;
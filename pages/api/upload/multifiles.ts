import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import multer from 'multer';
import { ApiResponse } from '@/models/ApiResponse';
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { promises as fsPromises } from 'fs';

interface MulterRequest extends NextApiRequest {
    files: any;
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

apiRoute.use(upload.array('myResumes'));

apiRoute.post(async (req, res) => {
    const files = req.files;
    const filesWeb3 = [];

    if (!files) {
        res.status(400).json({ error: "Khong co file trong request" })
    }

    // console.log(`${process.env.WEB3_STORAGE_API_KEY}`);

    let storageWeb3 = new Web3Storage({ token: `${process.env.WEB3_STORAGE_API_KEY}` });

    for (const file of files) {
        const pathFile = await getFilesFromPath(`${outputFolderName}/${file.originalname}`);
        console.log(`Uploading ${file.originalname} files`);
        const cid = await storageWeb3.put(pathFile, { name: file.originalname });
        const url = `https://ipfs.io/ipfs/${cid}/${file.originalname}`

        await fsPromises.writeFile(`${outputFolderName}/cid_uploaded.txt`, url + '\n', {
            flag: 'a+',
        });
        filesWeb3.push(url);
    }

    res.status(200).json(filesWeb3);
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
export default apiRoute;
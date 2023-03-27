
import { useState } from 'react'
import axios from 'axios';

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // const [selectedFile, setSelectedFile] = useState<any>(null);
  // const [loaded, setLoaded] = useState(0);

  // const handleSelectedFile = (event: any) => {
  //   setSelectedFile(event.target.files[0]);
  //   setLoaded(0);
  // }

  // const handleUpload = () => {
  //   const data = new FormData();
  //   data.append('file', selectedFile, selectedFile.name)

  //   console.log(data);

  //   axios
  //     .post('/api/upload', data, {
  //       onUploadProgress: (ProgressEvent: { loaded: number; total: number }) => {
  //         setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100);
  //       },
  //     })
  //     .then(res => {
  //       console.log(res.statusText)
  //     })
  // }
  return (
    <div>
      {/* <!--  SINGLE FILE --> */}
      <form action="/api/upload/singlefile" encType="multipart/form-data" method="POST">
        <input type="file" name="myResume" />
        <input type="submit" value="Upload a file" />
      </form>


      {/* <!-- MULTIPLE FILES --> */}
      <br />
      <form action="/api/upload/multifiles" encType="multipart/form-data" method="POST">
        <input type="file" name="myResumes" multiple />
        <input type="submit" value="Upload your files" />
      </form>

    </div>
  );
}

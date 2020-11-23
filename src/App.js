import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

export default function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'upload.mp4', await fetchFile(video));

    await ffmpeg.run(
      '-i',
      'upload.mp4',
      '-t',
      '5.0',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif'
    );

    const data = ffmpeg.FS('readFile', 'out.gif');

    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    );
    setGif(url);
  };

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <h3>Result</h3>
      <button onClick={convertToGif}>Convert</button>

      {gif && <img src={gif} />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

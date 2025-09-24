# Video Annotation Project

This project utilizes Google Cloud's Video Intelligence API to annotate videos. The annotated videos are saved in a specified output directory with their original filenames.

## Project Structure

```
video-annotation-project
├── src
│   ├── annotate.js         # Main script for video annotation
│   ├── utils
│   │   └── fileHandler.js  # Utility functions for file operations
├── config
│   └── gcpConfig.js        # Google Cloud configuration settings
├── input-videos            # Directory for input video files
│   └── (place your videos here)
├── output-videos           # Directory for saving annotated videos
│   └── (annotated videos will be saved here)
├── package.json            # npm configuration file
├── README.md               # Project documentation
└── .gitignore              # Git ignore file
```

## Setup Instructions

1. **Clone the repository**:

   ```
   git clone <repository-url>
   cd video-annotation-project
   ```

2. **Install dependencies**:

   ```
   pnpm install
   ```

3. **Configure Google Cloud**:
   - Create a Google Cloud project and enable the Video Intelligence API.
   - Set up authentication and download your service account key.
   - Update the `config/gcpConfig.js` file with your project details and authentication information.

4. **Add videos for annotation**:
   - Place your video files in the `input-videos` directory.

## Usage

To annotate the videos in the bucket, run the following command:

```
pnpm start
```

To upload files to bucket:
```sh
gsutil cp -r  /Volumes/GBT\ FILES/Video\ Editing/LETCHWORTH/Pyromany\ Letchworth  gs://gbt-test-bucket
```

The annotated videos will be saved in the `output-videos` directory with their original filenames.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the ISC License.

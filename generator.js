#!/usr/bin/env node

/**
 * @author      Adrian Preuß
 * @version     1.0.0
 */
const { execSync }  = require('child_process');
const Path          = require('path');
const FileSystem    = require('fs');
const HTTPS         = require('https');

async function downloadGoogleProtos() {
  const target = Path.join(__dirname, 'proto', 'google', 'protobuf');

  if(!FileSystem.existsSync(target)) {
    FileSystem.mkdirSync(target, { recursive: true });
  }

  const files = {
    'Wrappers.proto':   'https://raw.githubusercontent.com/protocolbuffers/protobuf/main/src/google/protobuf/wrappers.proto',
    'Timestamp.proto':  'https://raw.githubusercontent.com/protocolbuffers/protobuf/main/src/google/protobuf/timestamp.proto'
  };

  console.log('Downloading Google Protobuf definitions...');
  for(const [file, url] of Object.entries(files)) {
    const path = Path.join(target, file);

    if(FileSystem.existsSync(path)) {
      console.log(`   - ${file} already exists`);
      continue;
    }

    await new Promise((resolve, reject) => {
      HTTPS.get(url, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          FileSystem.writeFileSync(path, Buffer.concat(chunks));
          console.log(`   - Downloaded ${file}`);
          resolve();
        });
        response.on('error', reject);
      });
    });
  }
}

const config = {
  protoPath:        Path.join(__dirname, 'proto'),
  outputPath:       Path.join(__dirname, 'src', 'generated'),
  googleProtoPath:  Path.join(__dirname, 'proto', 'google'),
  plugin:           Path.join(__dirname, 'node_modules', '.bin', 'protoc-gen-ts_proto'),
  protoFiles: [
    'Main.proto'
  ],
  tsProtoOptions: [
    'env=browser',
    'outputServices=grpc-web',
    'esModuleInterop=true',
    'forceLong=long',
    'useOptionals=messages'
  ]
};

if(!FileSystem.existsSync(config.outputPath)) {
  FileSystem.mkdirSync(config.outputPath, { recursive: true });
  console.log(`Created output directory: ${config.outputPath}`);
}

const command = [
  'protoc',
  `--plugin=${config.plugin}`,
  `--ts_proto_out=${config.outputPath}`,
  `--ts_proto_opt=${config.tsProtoOptions.join(',')}`,
  `--proto_path=${config.protoPath}`,
  `--proto_path=${config.googleProtoPath}`,
  ...config.protoFiles.map(file => Path.join(config.protoPath, file))
].join(' ');

console.log('Generating TypeScript code from Proto files...');
try {
  downloadGoogleProtos().then(() => {
    execSync(command, { 
      stdio:  'inherit',
      cwd:    Path.join(__dirname)
    });

    console.log('\nProto files generated successfully!');

    const files = FileSystem.readdirSync(config.outputPath).filter(file => file.endsWith('.ts'));

    if(files.length > 0) {
      console.log('\nGenerated files:');
      
      files.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
  }).catch(err => {
    console.error('Failed to download google protos:', err.message || err);
    process.exit(1);
  });
} catch(error) {
  console.error('\nError generating proto files:');
  console.error(error.message);
  process.exit(1);
}
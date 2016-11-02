# SUMAQ Static Websites Generator

This is a simple static websites generator with Gulp, Pug, Stylus, Yaml, BrowserSync, etc. for publish to S3.
Based on HTML5 Boilerplate


## Important links

- [AWS Publish](https://github.com/pgherveou/gulp-awspublish)
- [AWS Config](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)


## Gulp tasks: ##

```  
    gulp serve          // Start with browsersync
    gulp serve:dist     // Start in production mode
    gulp build          // build the /dist folder
    gulp publish         // deploy dist folder in git server, before required config values (in deploy.env) and build site    
```  

## Tips
- Cambiar ruta de /fonts si es necesario
-

Crete file credentials.json

{
  "params": {
    "Bucket": "MY_BUCKET"
  },
  "region": "eu-central-1",
}




## Folders tree ##

```
static-website-generator/
├─ .tmp/                    // temporal files
├─ dist/                    // build folder to deploy in git
├─ node_modules/            // obviously,  node modules
├─ config/            // files to deploy in server, based on html5 boilerplate.
├─ src/
│  ├─ assets/             // assets folder
│  │   ├── fonts/
│  │   ├── images/
│  │   ├── scripts/
│  │   └── styles/
│  ├─ posts/              // demo folder to create a post
│  ├─ 404.jade
│  ├─ _data.json
│  ├─ _layout.json
│  ├─ favicon.png
│  └─ index.jade
├─ .editorconfig
├─ .gitignore
├─ .pug-lintrc
├─ gulpfile.js
├─ LICENSE
├─ package.json
└─ README.md     
```    

## Crear un sitio web: ##

1 Crear un proyecto con github o gitlab.

2 Clonar el proyecto
```  
mkdir my-website && cd $_
git clone --depth=1 https://github.com/elingan/static-websites-generator.git .    // dont forget "."
```

3 Reinicializar la carpeta .git
```
rm -rf .git && git init
```

4 Asociarlo a al repositorio
```
git remote add origin git@.../my-website-repository.git
```

5 Instalar dependencias
```
  npm install
```

6 Actualizar el config gulpfile.js  

## TODO

- Implementar Yeoman Generator
- Ampliar la documentación
- Documentar en el caso especial username.github.io
- Configuración en GitHub con CNAME

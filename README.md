# SUMAQ Static Websites Generator

Un sencillo generador de sitios web estáticos que usa Gulp, Pug, Stylus, Yaml, BrowserSync y otros componentes y que publica el sitio en un bucket de AWS S3.
Esta basado en las recomendaciones de HTML5 Boilerplate.


## Crear un sitio web: ##

### Clonar el proyecto, integrarlo a git e instalar dependencias
```  
  git clone https://github.com/elingan/sumaq-static-websites-generator.git MY_WEBSITE_FOLDER
  cd MY_WEBSITE_FOLDER
  rm -rf .git && git init
  git remote add origin git@.../my-website-repository.git
  npm install
```

### Actualizar gulpfile.js  
Actualizar los datos de configuración para:
```
  config {
    ...
    siteUrl:'http://generator.sumaqwebsites.com',
    analyticsId:'X-99999-X',
    ...
  }
```

### Configuración AWS S3
Se debe configurar usando las recomendaciones de [AWS Publish](https://github.com/pgherveou/gulp-awspublish)
AWS S3 requiere un archivo de configuración "./credentials.json" con el siguiente contenido
```
{
  "params": {
    "Bucket": "MY_BUCKET"
  },
  "region": "eu-central-1",
}
```

### Otras recomendaciones
- Cambiar ruta de /fonts si es necesario
-


## Links

- [AWS Publish](https://github.com/pgherveou/gulp-awspublish)
- [AWS Config](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)


## Gulp tasks: ##

```  
    gulp serve          // Start with browsersync
    gulp serve:dist     // Start in production mode
    gulp build          // build the /dist folder
    gulp publish         // deploy dist folder in git server, before required config values (in deploy.env) and build site    
```  


## Folders tree ##

```
static-website-generator/
├─ .tmp/                    // temporal files
├─ dist/                    // build folder to deploy in git
├─ node_modules/            // obviously,  node modules
├─ config/                  // files to deploy in server, based on html5 boilerplate.
├─ src/
│  ├─ assets/               // assets folder
│  │   ├── fonts/
│  │   ├── images/
│  │   ├── scripts/
│  │   └── styles/
│  ├─ posts/               // demo folder to create a post
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

## TODO

- Actualizar la documentación
- Traducir al inglés

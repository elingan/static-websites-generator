# Static Websites Generator

Un sencillo generador de sitios web estáticos que usa Gulp, Pug, Stylus, Yaml, BrowserSync y otros componentes.

## Crear un sitio web: ##

- Publica la carpeta dist en un bucket de AWS S3.
- Esta basado en las recomendaciones de HTML5 Boilerplate.

### Clonar el proyecto, integrarlo a git e instalar dependencias
```  
git clone https://github.com/elingan/sumaq-static-websites-generator.git MY_WEBSITE_FOLDER
cd MY_WEBSITE_FOLDER
rm -rf .git && git init
git remote add origin git@.../my-website-repository.git
npm install
```

### Configuración AWS S3
Se debe configurar usando las recomendaciones de [AWS Publish](https://github.com/pgherveou/gulp-awspublish)

### Actualizar gulpfile.js  
Actualizar los datos de configuración para:
```
global.siteUrl = 'http://example.com';
global.analyticsId = 'X-99999-X';
```

Actualizar la configuración AWS S3
```
global.credentials = {
  params: {
    Bucket: 'www.example.com'
  },
  region: 'eu-central-1'
}
```

### Publicar en github

- Crear el proyecto github. [Github Pages](https://pages.github.com/)
- Publicar en github pages usando este [gist](https://gist.github.com/cobyism/4730490).

```
Para username.github.io puede reemplazar reemplazar:
git subtree push --prefix $1 REMOTE_GITHUB GITHUB_BRANCH

```


### Otras recomendaciones
Cambiar ruta de /fonts si es necesario
El layout para los POSTS debe ser _foldername.pug_



## Links

- [AWS Publish](https://github.com/pgherveou/gulp-awspublish)
- [AWS Config](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)


## Gulp tasks: ##

```  
gulp serve                 // Start with browsersync
gulp serve:dist            // Start in production mode
gulp build [--production]  // build the /dist folder to production (default develop)
gulp publish               // deploy /dist folder on AWS S3 bucket    
```  


## Folders tree ##

```
static-website-generator/
├─ .tmp/                    // temporal files
├─ dist/                    // build folder to deploy in git
├─ node_modules/            // obviously,  node modules
├─ src/
│  ├─ assets/               // assets folder
│  │   ├── fonts/
│  │   ├── images/
│  │   ├── scripts/
│  │   └── styles/
│  ├─ config/               // files to deploy in server, based on html5 boilerplate.
│  ├─ posts/                // demo folder to create a post
│  ├─ _layout.pug
│  ├─ data.yaml
│  ├─ error.pug
│  ├─ favicon.png
│  └─ index.pug
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

const packageName = 'ionicons'
const iconSetName = 'Ionicons'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { resolve } = require('path')

let skipped = []
const distFolder = resolve(__dirname, `../ionicons-v4`)
const { defaultNameMapper, extract, writeExports } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/dist/ionicons/svg/`)
const svgFiles = glob.sync(svgFolder + '/*.svg')
const iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach(file => {
  const name = defaultNameMapper(file, 'ion')

  if (iconNames.has(name)) {
    return
  }

  try {
    const { svgDef, typeDef } = extract(file, name)
    svgExports.push(svgDef)
    typeExports.push(typeDef)

    iconNames.add(name)
  }
  catch(err) {
    console.error(err)
    skipped.push(name)
  }
})

writeExports(iconSetName, packageName, distFolder, svgExports, typeExports, skipped)

// then update webfont files

const webfont = [
  'ionicons.woff',
  'ionicons.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${packageName}/dist/fonts/${file}`),
    resolve(__dirname, `../ionicons-v4/${file}`)
  )
})

copySync(
  resolve(__dirname, `../node_modules/${packageName}/LICENSE`),
  resolve(__dirname, `../ionicons-v4/LICENSE`)
)

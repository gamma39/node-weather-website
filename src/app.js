const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//create instance of express
const app = express()

//allow port to be set by heroku or local if not deployed yet
const port = proccess.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//needed to serve all pages but index.html. otherwise it won't work
const options = {
    extensions: ['html', 'htm']
}

//setup static directory to serve
app.use(express.static(publicDirectoryPath, options))

//index.hbs call aka front page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'James'
    })
})

//render about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'James'
    })
})

//render help page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'James',
        message: 'This page has instructions for help'
    })
})

//render weather app
app.get('/weather', (req, res) => {
    //check if address exists in query string
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        }
        forecast(longitude, latitude, (error, data) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                forecast: data,
                location,
                address: req.query.address
            })

        })
    } )
   
})

//render 404 page for help links
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'James',
        message: 'Help article not found'
    })
})

//render generic 404 page
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'James',
        message: 'Page not found'
    })
})

//start server using listen and the necessary port
app.listen(port, () => {
    console.log('Server is up on port' + port)
})
# Haicoo
> A PWA that poems based on photos provided by users

## Instructions
Click upload image<br />
we will give you a haiku!<br />
...then try it again!<br />

## The Team
* Arianna Campesi
* Jessica Choi
* Nichole Cruzalegui
* Yourhee Lily Min


## Site Walk-Through
* Click Get Started
* Upload Photo
* Click Give Me a Haiku

## Get Started
```
git clone https://github.com/TheDonnas/Haicoo.git
npm install
npm start
```

## Key Concepts

The TensorFlow model MobileNet is loaded and saved onto the component's state. User-provided data is kept private since classifications are performed locally.

While there is no need for a persistent network connection to continue classifying images we have provided a default word bank in the case that the DataMuse API is unavailable.

Haicoo can run on a desktop platform and be 'installed' on a mobile device. Our manifest file allows the app to be 'installed' on mobile devices, creating a native app experience complete with an app icon on the home screen.


## Links

* [Node.js](https://nodejs.org/) an open source JavaScript runtime environment, built on top of Chrome's V8 engine that executes JavaScript code outside of a web browser.
* [TensorFlow.js](https://www.tensorflow.org/js) an open source platform for machine learning.
* [React](https://reactjs.org/) created for developers to make
through the use of a virtual DOM it
a javascript library used for creating interactive UIs.
keeps UI & state in-sync
Triggers => state change
Uses virtual DOM, compares with regular DOM and renders any changes
* [Datamuse API](http://www.datamuse.com/api/)
* [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)
* [Workbox](https://github.com/GoogleChrome/workbox)
* [Bootstrap](https://getbootstrap.com)
* [Shards](https://designrevision.com/docs/shards/index.html)

## Credits

* [Dog Classifier](https://github.com/jonnyk20/dogscope-react) by Jonny Kalambay
* [Haiku Generator](https://github.com/d-rivera-c/haiku-generator) by d-rivera-c
* Images by [Joanna Kosinska](https://github.com/d-rivera-c/haiku-generator)

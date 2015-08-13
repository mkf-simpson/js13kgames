//@requires configuration.js

var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d');

canvas.width = Configuration.width;
canvas.height = Configuration.height;

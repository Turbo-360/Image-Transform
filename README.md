# Image Transform

This project was built with Turbo 360. To learn more, click here: https://www.turbo360.co

## Instructions
After cloning into repo, cd to project root directory and run npm install:

```
$ npm install
```

To run dev server, install Turbo CLI globally:

```
$ sudo npm install turbo-cli -g
```

Then run devserver from project root directory:

```
$ turbo devserver
```

## Documentation
Image transform takes an image url and returns three formatted versions: original, cropped and thumbnail. The formatted results can also be extended to more additional versions by appending a suffix at the end of the original url for greater scaling and cropping options.

## Example

## Step 1
Find an image online or use this as an example: http://img.usmagazine.com/480-width/tom-brady-zoom-e80aba06-7468-4352-9280-ae37b2d73eba.jpg

## Step 2
Enter the image url into the follwing endpoint as the 'url' query parameter (make sure there are no query parameters in the image url itself):

```
https://api.turbo360.co/vectors/image-transform-vn0vgw/transform?format=json&url=http://img.usmagazine.com/480-width/tom-brady-zoom-e80aba06-7468-4352-9280-ae37b2d73eba.jpg
```

This will return a JSON payload with example image urls for the original size, scaled and a thumbnail 


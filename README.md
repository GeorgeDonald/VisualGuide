<!DOCTYPE html>
<html>
<h1>Visual Guide</h1>
<p>This Web App was written in Ruby on Rails in the back end, and in HTML, JavaScript in front end, and ActionCable in the back and front end. And it uses Google Map StreetView, Directions, Places APIs.</p>
<p>It tries to take you to somewhere you didn't get to, and take a look at it in advance, or take a route to take a look at the scenery of it. </p>
<h3>Take a look at these pictures: </h3>
<img src="./public/images/streetview2.jpeg" >
<img src="./public/images/streetview3.jpeg" >
<img src="./public/images/streetview4.jpeg" >

<p>Do you know where they are?</p>
<a href="https://virtualtravel.herokuapp.com" target="_blank">Try this to find it out.</a>

<p>You need a Goodle API key to play it. Go <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">here</a> to get one for free, and don't forget going <a href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend,places_backend&reusekey=true">here</a> to enable Street View, Directions, and Places APIs. It may take you a few minutes, but it worth it.</p>

</p>When you registered or logged in, you get this:</p>
<img src="./public/images/uishot1.png">
<p>Click on the StreetView image, and hit 'up', 'down', 'left', 'right' arrow keys to go forward, backward, turn left, right. And hit '&lt;' or '&gt;' keys to step left or right. And hit 'PageUp' and 'PageDown' to pitch up and down.</p>

<p>Click the avatar to show the main menu:</p>
<img src="./public/images/uishot2.png">

<p>In Travel menu, you can select a start and a end places, then you can play it. It'll make a route for you, and play the StreetView of the route automatically, just like view a movie.</p>

<h3>Explore it, enjoy it and have fun!</h3>
</html>

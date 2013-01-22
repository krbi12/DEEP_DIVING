<h1>Deep Diving</h1>

<p>Welcome to the home of "Deep diving", a game for HTML5.</p>
  <p>The diver has reached all the way down to the Challanger Deep, the lowest place on earth. You must help him to get to the surface before the oxygen expires. The colored objects that are floating around will help the diver to bounce up to the surface. The orange objects provide regular bounces, the green ones gives the diver an extra boost. On rare occassions a supercharged purple object emergerges, try reaching for it. Whatever you do, don't step on a black object, or the diver will die.<br />You control the left and right movements of the diver either with the mouse, or with the left end right arrow keys. You start a new game by clicking "Enter. "Good luck!</p>
    <p>If you want to incorperate the game on your website, you are most welcome to do so. The steps are very simple.</p>
    <ul>
    <li>Download the project from Github (link provided above).</li>
    <li>Unzip the files and save them in a folder on your computer.</li>
    <li>Upload the folder "game" to your webserver. It should be uploaded into <strong>the same folder</strong> as the page where you want to implement the game.</li>
    <li>
Now it is time to edit the page where you want the game to appear. Right before the closing &lt;/body&gt;-tag the following code should be pasted.<br />
<pre><code>&lt;script src="game/game.js"&gt;&lt;/script&gt;</code></pre>
</li>
<li>
Now paste the following code at the place in your page where the game should be displayed.
<pre><code>&lt;canvas id='gameArea'&gt;&lt;/canvas&gt;</code></pre>
<li>
Finally, if you want a button for starting a new game, paste the following code where you want the button to appear. This step is optional, since it is also possible to start a new game by hitting ENTER.
<pre><code>&lt;input type="button" value="Start a new game" onClick="window.location.href=window.location.href" /&gt;</code></pre>
</li>
</li>
    </ul>
    <p>
    In the download from Github there is also a file called "deepdive.html". If you open it in an editor you can see exactly where the code snippets should go. You can also upload this file to the same directory as the "game"-folder, point your browser to the file, and play the game from there.
    </p>

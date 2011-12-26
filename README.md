Charlotte Sometimes Post-mortem
=================================

![sketchbook image](http://www.hyperlogic.org/images/cs-postmortem01.jpeg]

The Dare is my iron.  To quote Henry Rollins:

> The Iron never lies to you. 
> You can walk outside and listen to all kinds of talk, get told that you're a god or a total bastard. 
> The Iron will always kick you the real deal. 
> The Iron is the great reference point, the all-knowing perspective giver. 
> Always there like a beacon in the pitch black. 
> I have found the Iron to be my greatest friend. 
> It never freaks out on me, never runs. Friends may come and go. 
> But two hundred pounds is always two hundred pounds.

Coding a game in 48 hours is humbling.
I might think I'm a coding bad-ass but the Dare tells it true.

My main goal was to spend less time on the code and more time on the art and the game.
I did manage to spend more time on art, but I feel I failed on the level design.

But first lets talk about the positive.

What went right
------------------

### ImpactJS

Impact JS is a pretty awesome tool kit.
I had the level-editor in one browser tab, and the game itself in the other.
Iteration was quick, just save the level, edit some code, then Alt-tab to the browser and hit Alt-R.
In less then a second, you're in your new level.  Publishing was a pleasure, just run a shell script to minify the source and upload to a public facing web server. 
DONE!

### JavaScript

JavaScript doesn't suck as much as you think.
It has all the dynamic language goodness: Garbage Collection, Arrays, Objects/Hash Tables, Total mutability.
There were a couple times where I used properties to stick some random shit on an entity object. 
No need to create accessors or mark things as public. Everything is open and changeable, like putty.
Maybe not the best feature from a "Software Engineering" perspective, but this is a big advantage for writing code quickly.

![sketchbook image](http://www.hyperlogic.org/images/cs-postmortem03.jpeg]

### Paper

I used a sketch pad on my left.  I wrote down level ideas, todo lists, item sketches.
There's something about the act of writing things down and laying things out spatially that helps me understand complex problems and ideas.
I used it less for reference and more for brainstorming.

### Acorn

The best feature was the pixel grid overlay, which was unobtrusive and effective, even at high zoom levels.
Once I got used to the keyboard shortcuts, it was good for some serious pixel-pushing.


What went wrong
------------------

### My brain

Coding up the water flow algorithm at 3AM was a BAD IDEA.  I had several false starts, and ended up spinning my wheels for 3 hours. DUMB.
I had to give up and get some sleep.  When I came back fresh, I nailed it.
But in hindsight, I should have done the deep-thinking early, and left the late nights for art and polish.

### Block Physics

The default ImpactJS physics just wasn't up to the task, or I wasn't using it correctly.
After some play-testing I realized that I couldn't have pixel perfect accuracy.
A block of 8 pixels sometimes wouldn't fit through an 8 pixel gap.
The frustrating part was that this bug happened infrequently and intermittently.
To workaround, I had to add extra some extra fudge factor to gaps and had to write special code to detect when two blocks were nearby but not touching.
Even with this, the act of moving the blocks is error-prone and frustrating.

### Game Design Fail

![sketchbook image](http://www.hyperlogic.org/images/cs-postmortem02.jpeg]

I blew all my time on the blocks and water flow, I didn't have enough time to implement the other mechanics needed to create a better puzzle game.
It needed more game elements.  I had plans for pressure plates, traps and conveyor belts.
It would have been a lot of fun to combine these in interesting ways, but I just didn't have the time.


Conclusion
-------------

Even with the negatives, I had fun.  It was fun to do some pixel-pushing again.  I learned a new framework, and got a chance to become more familiar with JavaScript.
I'm no notch, but I finished something I can point to and share with others.
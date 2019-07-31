## Fill View

Link to active prototype: [Fill View](https://legrand.io/fill-view/)

As a former retail pharamcist of 5+ years, I always felt like the prescription drug monitoring program (PDMP) user interface was horrible.  The results of a search (at least in the state where I worked) were returned in a PDF document which didn't allow for any interaction (sorting / filtering / decision support / etc), prescriber and pharmacy information was hidden away at the bottom of the PDF and only referred to within the data as a strange code name, and trying to figure out whether a patient had red flags for prescription diversion took way more math and focus than it needed to.

I always thought there had to be a better way, and wanted to mock-up some potential UI designs.  I started with some Google charts, but quickly had to abandon them and move toward custom SVG visualizations using D3.js because nothing out of the box seemed to be working.  I ended up building a functional prototype using ReactJS and D3.js.

![Fill View](https://github.com/jrlegrand/jrlegrand.github.io/blob/master/img/fill-view/fillview.jpg)

And this is an example of what the PDMP currently looks like in my state for the same patient (all of this is fake data, FYI).

![PDMP](https://github.com/jrlegrand/jrlegrand.github.io/blob/master/img/fill-view/pdmp.jpg)

How quickly can you tell whether or not this patient is filling controlled substances early with the PDF versus the visualization?

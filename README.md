# Weather-forecast

Authors: Eylon Mazor and Dor Rozin 

Execution
The submission is a WebStorm project that can be run directly from the IDE.

Assumptions
The site use bootstrap CDN therefore assumes an internet connection is available.
The site uses an API service, therefore assumes the server is up and internet connection is available.
The site is based on NodeJS Express, therefore assumes that the command "npm install" has taken place.

Notes
The project is a NodeJS Express project.

Before running the project, the command "npm install" must take place.

The project divided to few folders: public, routes and views (and other folders related to database).
The public folder contains images, stylesheets and all the client-side javascripts.
The routes folder contains all the server-side javascripts, include the router commands.
The views folder contains all the "Dynamic HTML" ejs pages, which will be the outcome which the user will see.

The API we have used contain some shortcuts for weathers that we do not know.
Therefore, we have translated the shortcuts that we did figure out, and left the others as is.

Behaviours
We have set up few spacial behaviours in the website:

When signing up, names should contain ONLY English letters.
Every address entered after localhost:3000/ will force a redirect and will present the login page.
If one user is logged in, any tries to register/login in a new tab will be redirected to weather page of the first user.
If two tabs are open at the weather page of a user, logging out in one of them will cause an
immediate stop of database actions on the other tab. All client side functions will work, but nothing will be saved.
If a user logging off, no one can make database changes until a user is logging in.
Bottom line- only ONE user can be online!

Submitted at January 23rd, 2021

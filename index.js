const APP = require('express')();
const PORT = 1234;

APP.listen(
    PORT,
    () => console.log(`hij doet het op port ${PORT}`)
);

// Middleware basis HTTP basic auth 'security' check ;)
// Voortaan dus een req, een res én een next functie input
// expres even uitgeschreven functie
function authenticatie (req,res,next) {

    console.log('Gebruikte headers: ', req.headers);
    if (req.headers.authorization) {

        const auth = {
            username: 'test', password: 'testpassword'
        }

        // HTTP basic auth gebruikt Base64, kán leeg zijn:
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

        if (username === auth.username && password === auth.password) {
            // meegegeven functie v/h op toegepaste request (get/post/etc) draaien
            return next();
        }

        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send('Geen geldige authenticatie');
    }

    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Geen geldige authenticatie');
}

APP.use(authenticatie);

const DATA = [
    {
        merk: 'BMW',
        type: '2002 Turbo'
    },
    {
        merk: 'Audi',
        type: 'Quattro Sport'
    },
    {
        merk: 'Nissan',
        type: 'Skyline GTR'
    }
];

APP.get(
   '/autos/:merk',
    (req, res) => {
       console.log(req.params.merk);
       let RESULT = DATA.find(
           (el)=>{
             return el.merk.toLowerCase() == req.params.merk.toLowerCase()
           }
       );

       RESULT = RESULT!=undefined?RESULT:{ Fout: 'Geen data gevonden' };

       res.status(200).send(
           // return opgevraagde auto
           RESULT
       );
    }
);

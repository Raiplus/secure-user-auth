import bcrypt from 'bcrypt'
const saltRounds = 10;
const myPlaintextPassword = 'Rishabh';
const someOtherPlaintextPassword = 'Rishabh';
//$2b$10$hADPXuwsMjPWSsH3m69QSOXfmKbRslocYvx/FnO2EOEmPcbHwwmcG
bcrypt.compare(myPlaintextPassword, "$2b$10$hADPXuwsMjPWSsH3m69QSOXfmKbRslocYvx/FnO2EOEmPcbHwwmcG", function(err, result) {
    
        console.log(result)
    
    // result == true
});

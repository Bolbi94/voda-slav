// import ImapClient from 'emailjs-imap-client';

// export function InitImapClient() {
//   let imap = new ImapClient('imap.gmail.com', 993, {
//     auth: {
//       user: 'watercounters@gmail.com',
//       pass: 'CountersReadings'
//     }
//   });
//   imap.connect()
//     .then((data) => {
//       console.log("connected", data, imap);
//       return imap;
//     })
// }

//"core-js": "^2.6.10",

// var imaps = require('imap-simple');
 
// var config = {
//     imap: {
//         user: 'watercounters@gmail.com',
//         password: 'CountersReadings',
//         host: 'imap.gmail.com',
//         port: 993,
//         tls: true,
//         authTimeout: 3000
//     }
// };

// export function InitImapClient()  {
//   imaps.connect(config).then(function(connection) {
//     console.log(connection);
//     return connection;
//   })
// }

// var Imap = require('imap');
 
// var imap = new Imap({
//   user: 'watercounters@gmail.com',
//   password: 'CountersReadings',
//   host: 'imap.gmail.com',
//   port: 993,
//   tls: true
// });

// export function InitImapClient() {
//   imap.connect();
//   return imap;
// }
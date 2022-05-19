const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

export async function sendMail(to, petname, username, phone, where){
    
    const msg = {
      to, // Change to your recipient
      from: "lupattin@gmail.com", // Change to your verified sender
      subject: `${username} ha indicado que encontro a ${petname}`,
      text: `Hola, soy ${username}, y encontre a ${petname}. Te dejo mi telefono ${phone}, para que puedas comunicarte. Te dejo informacion de donde la deje:${where}`,
      html: `Hola, soy <strong>${username}</strong>, y encontre a <strong>${petname}</strong>.<br />Te dejo mi telefono <strong>${phone}</strong>, para que puedas comunicarte.<br /> Te dejo informacion de donde lo encontre: <strong>${where}</strong>`
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}
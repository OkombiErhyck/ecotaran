const nodemailer = require('nodemailer');

const sendEmail = async (formData) => {
  try {
    // Create a transporter with Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ecotaran91@gmail.com',
        pass: 'EcoTaran123!',
      },
    });

    // Compose the email message
    const message = {
      from: 'ecotaran91@gmail.com',
      to: 'okombie@gmail.com',
      subject: 'New Order',
      text: `A new order has been placed:\n\n
             First Name: ${formData.firstName}\n
             Last Name: ${formData.lastName}\n
             Email: ${formData.email}\n
             Address: ${formData.address}\n
             City: ${formData.city}\n
             Zip Code: ${formData.zipCode}\n`,
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;

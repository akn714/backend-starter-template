"use strict";

const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD || !process.env.FROM_EMAIL) {
    throw new Error('Missing required email environment variables (EMAIL, EMAIL_PASSWORD, FROM_EMAIL)');
}

/**
 * Sends an email based on the provided type and data.
 * @param {string} type - The type of email to send ('signup' or 'resetpassword').
 * @param {object} data - The data to populate the email with.
 * @param {string} data.name - The name of the recipient (for 'signup').
 * @param {string} data.email - The recipient's email address.
 * @param {string} [data.resetPasswordLink] - The reset password link (for 'resetpassword').
 */
async function sendMail(type, data) {
    try {
        // Configure the transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let subject, html;

        // Customize email based on the type
        switch (type) {
            case 'signup':
                if (!data.name || !data.email) {
                    throw new Error("Missing required data for 'signup' email.");
                }
                subject = `Thank you for signing up, ${data.name}`;
                html = `
                    <div>
                        <h1>Welcome to <span style='color:blue'>Backend-Starter-Template</span></h1>
                        <p>We hope you have a great experience!</p>
                        <div>
                            <p>Here are your details:</p>
                            <p>Name: ${data.name}</p>
                            <p>Email: ${data.email}</p>
                        </div>
                    </div>`;
                break;

            case 'resetpassword':
                if (!data.email || !data.resetPasswordLink) {
                    throw new Error("Missing required data for 'resetpassword' email.");
                }
                subject = 'Reset Your Password';
                html = `
                    <div>
                        <h1>Backend-Starter-Template</h1>
                        <p>Click <a href='${data.resetPasswordLink}'>here</a> to reset your password.</p>
                    </div>`;
                break;

            default:
                throw new Error("Invalid email type specified.");
        }

        // Send email
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL, // Sender address
            to: data.email, // Receiver's email address
            subject, // Subject line
            html, // Email content (HTML)
        });

        console.log(`[+] Email sent successfully: ${info.messageId}`);
        return true; // Indicates success
    } catch (error) {
        console.log(`[-] Failed to send email: ${error.message}`);
        throw error; // Re-throw the error for the caller to handle
    }
}

module.exports = sendMail;

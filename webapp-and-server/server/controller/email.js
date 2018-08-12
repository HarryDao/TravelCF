const NodeMailer = require('nodemailer');

const { EMAIL: { account, service } } = require('../../configs/server');

class Email {
    constructor() {
        this.Send = this.Send.bind(this);

        this.transporter = NodeMailer.createTransport({
            service,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
    }

    Send({ to, subject, html }) {
        const options = {
            from: account.user,
            to,
            subject,
            html
        }
        this.transporter.sendMail(options, (err, info) => {
            if (err){
                console.error('Error sending email:', err);
            }
            else {
                console.log(`Email sent to ${to}`);
            }
        });
    }
}

module.exports = new Email();
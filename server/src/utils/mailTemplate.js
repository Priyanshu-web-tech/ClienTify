const mailTemplate = (customerName, campaignMsg) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #007bff;
            color: #fff;
            padding: 10px 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #333;
          }
          .footer {
            text-align: center;
            margin: 20px 0;
            font-size: 12px;
            color: #777;
          }
          .btn {
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Special Offer from Clientify!</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>${campaignMsg}</p>
            <a href="#" class="btn">Learn More</a>
          </div>
          <div class="footer">
            <p>&copy; 2024 Clientify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const otpEmailTemplate = (otp) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            background-color: #007bff;
            color: #fff;
            padding: 10px 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #333;
          }
          .otp {
            text-align: center;
            font-size: 24px;
            color: #007bff;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin: 20px 0;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>We received a request to reset your password. Use the following One-Time Password (OTP) to complete your request:</p>
            <div class="otp">${otp}</div>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Clientify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
export { mailTemplate, otpEmailTemplate};
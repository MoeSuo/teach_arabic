import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  const prisma = new PrismaClient();

  try {
    // Check if the user exists with the given email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random reset token and token expiry time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = new Date(new Date().getTime() + 3600000); // Token expires in 1 hour

    // Save the reset token and expiry in the user record
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // I use sendgrid to send the reset password email
    const baseURL = process.env.NEXT_PUBLIC_APP_URL;
    const resetLink = `${baseURL}/user/setNewPassword?token=${resetToken}&email=${email}`;
    const msg = {
      to: email,
      from: "mohamed.sallam@learnit.fi", // Replace with your verified sender email
      subject: "Reset Your Password",
      // html: `Click the link below to reset your password:<br/><a href="${resetLink}">${resetLink}</a>`,
      html: `<body>
      <center class="wrapper" data-link-color="#000000" data-body-style="font-size:14px; font-family:tahoma,geneva,sans-serif; color:#000000; background-color:#FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tbody><tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="700">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:700px;" align="center">
                                      <tbody><tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tbody><tr>
      <td role="module-content">
        <p>Start Growing Now</p>
      </td>
    </tr>
  </tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9f868e33-21ac-40c8-86bc-8c97d7cd69f0">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="700" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/4fa35dec0c63668e/d927c411-506c-48dd-bbe0-d410543e5ac8/1280x853.jpg">
        </td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 10px 0px 10px;" bgcolor="#dfffea" data-distribution="1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="520" style="width:520px; border-spacing:0; border-collapse:collapse; margin:0px 80px 0px 80px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="9fb55e76-a41f-446c-9893-536720221578" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:20px 0px 20px 0px; line-height:30px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><h1 style="text-align: center">🌱 Reset Your Garden App Password 🌿&nbsp;</h1><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="abfcf137-fac5-4666-93df-b6940cd872ca" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 0px 25px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><br></div>
<div style="font-family: inherit; text-align: inherit"><br></div>
<div style="font-family: inherit; text-align: inherit"><strong>Hey there, Gardener Extraordinaire!&nbsp;</strong></div>
<div style="font-family: inherit; text-align: inherit"><br></div>
<div style="font-family: inherit; text-align: inherit">Oops! It happens to the best of us - forgetting our passwords. But fret not, we've got your back! 🌱🔒</div>
<div style="font-family: inherit; text-align: inherit"><br></div>
<div style="font-family: inherit; text-align: inherit">To regain access to your lush green world in the Garden App, simply Click on the "Reset Password" link below:&nbsp;</div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b9ab16e6-c24c-4fe9-8789-2209509ec1c3">
    <tbody>
      <tr>
        <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d61458c8-876e-44ce-9554-b8854b1f44ba">
      <tbody>
        <tr>
          <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
              <tbody>
                <tr>
                <td align="center" bgcolor="#77faa5" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                  <a href="${resetLink}" style="background-color:#77faa5; border:0px solid #333333; border-color:#333333; border-radius:9px; border-width:0px; color:#000000; display:inline-block; font-size:14px; font-weight:bold; letter-spacing:1px; line-height:normal; padding:25px 85px 25px 85px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">RESET PASSWORD</a>
                </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b9ab16e6-c24c-4fe9-8789-2209509ec1c3.1">
    <tbody>
      <tr>
        <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#000000; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:center;" data-muid="3c9d764e-290c-4114-89f6-e6e2c6cc61d1"><div class="Unsubscribe--addressLine"></div><p style="font-size:12px; line-height:20px;"><a target="_blank" class="Unsubscribe--unsubscribeLink zzzzzzz" href="{{{unsubscribe}}}" style="color:#ffffff;">Unsubscribe</a></p></div></td>
                                      </tr>
                                    </tbody></table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </div>
      </center>
    
  </body>`,
    };
    await sgMail.send(msg);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while sending the reset password email",
      });
  } finally {
    prisma.$disconnect();
  }
}

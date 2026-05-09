import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPublishedEmail(email: string, businessName: string, siteUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Zemen Co. <hello@zemenco.com>',
      to: [email],
      subject: `Your ${businessName} website is now LIVE! 🚀`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #F4F5F7; padding: 40px 20px;">
          <div style="background-color: #ffffff; border-radius: 24px; padding: 40px; text-align: center; border: 1px solid #E8F5F1; box-shadow: 0 4px 20px rgba(15, 40, 32, 0.05);">
            <div style="width: 80px; height: 80px; background-color: #E8F5F1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
              <span style="font-size: 40px;">🚀</span>
            </div>
            <h1 style="color: #0F2820; font-size: 28px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em;">Congratulations!</h1>
            <p style="color: #57657A; font-size: 16px; font-weight: 500; line-height: 1.6; margin-bottom: 32px;">
              Your business, <strong>${businessName}</strong>, is now online. Your world-class digital presence is officially live and ready to welcome customers.
            </p>
            <div style="background-color: #F8FAFB; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #F1F1F1;">
              <p style="color: #57657A; font-size: 14px; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Your Live URL</p>
              <a href="${siteUrl}" style="color: #1D9E75; font-size: 18px; font-weight: 700; text-decoration: none;">${siteUrl}</a>
            </div>
            <a href="${siteUrl}" style="display: inline-block; background-color: #0F2820; color: #ffffff; padding: 18px 36px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; transition: background-color 0.2s;">Visit Your Website</a>
            <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #F1F1F1;">
              <p style="color: #57657A; font-size: 14px; margin-bottom: 16px;">Next steps:</p>
              <ul style="text-align: left; color: #57657A; font-size: 14px; padding: 0; list-style: none; margin: 0 auto; max-width: 300px;">
                <li style="margin-bottom: 12px; display: flex; align-items: center;">
                  <span style="color: #1D9E75; margin-right: 12px;">✓</span> Share on WhatsApp
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: center;">
                  <span style="color: #1D9E75; margin-right: 12px;">✓</span> Add to your Instagram bio
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: center;">
                  <span style="color: #1D9E75; margin-right: 12px;">✓</span> Update your Google Business profile
                </li>
              </ul>
            </div>
          </div>
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #57657A; font-size: 12px; font-weight: 500;">
              Built with excellence by Zemen Co. <br/>
              <em>Deep Roots. Limitless Growth.</em>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (e) {
    console.error('Email send failed:', e);
    return { success: false, error: e };
  }
}

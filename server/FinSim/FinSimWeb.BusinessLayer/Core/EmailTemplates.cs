namespace FinSim.BusinessLayer.Core;

public static class EmailTemplates
{
    public static string BuildVerificationCodeEmail(string heading, string introText, string code, string footerText)
    {
        return $$"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#10160f;font-family:'Work Sans',Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#10160f;padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width:480px;background:#182019;border:1px solid #2c3a2c;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td style="padding:28px 32px 0 32px;">
                      <div style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#eef1ea;">FinSim</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 32px 8px 32px;">
                      <h1 style="margin:0;font-size:18px;color:#eef1ea;font-weight:600;">{{heading}}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 24px 32px;">
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#a9b6a4;">{{introText}}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 28px 32px;" align="center">
                      <div style="display:inline-block;background:rgba(217,165,69,0.14);border:1px solid #d9a545;border-radius:6px;padding:16px 32px;">
                        <span style="font-family:'IBM Plex Mono',Consolas,monospace;font-size:32px;letter-spacing:8px;color:#d9a545;font-weight:600;">{{code}}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 28px 32px;">
                      <p style="margin:0;font-size:13px;color:#a9b6a4;">{{footerText}}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
    }
}

import { Resend } from 'resend';

// Use a dummy key during build time if the real one isn't set yet
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummykey_for_build');
const FROM_EMAIL = 'WhoDo Suporte <suporte@whodo.newsdrop.net.br>'; // Update domain if needed

export async function sendPasswordResetEmail(email: string, resetLink: string, userName: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Redefinição de Senha - WhoDo!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">WhoDo!</h1>
            <p style="color: #64748B; margin-top: 5px;">Quem precisa encontra. Quem faz escolhe.</p>
          </div>
          
          <div style="background-color: #F8FAFC; border-radius: 12px; padding: 30px; border: 1px solid #E2E8F0;">
            <h2 style="margin-top: 0; color: #1E293B;">Olá, ${userName}!</h2>
            <p style="line-height: 1.6;">Recebemos uma solicitação para redefinir a senha da sua conta no <strong>WhoDo!</strong>. Se foi você, clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
            </div>
            
            <p style="line-height: 1.6; font-size: 14px; color: #64748B;">Este link é válido por apenas <strong>1 hora</strong>. Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança. Sua conta continua protegida.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94A3B8;">
            <p>© ${new Date().getFullYear()} WhoDo! Marketplace. Todos os direitos reservados.</p>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return { success: false, error };
  }
}

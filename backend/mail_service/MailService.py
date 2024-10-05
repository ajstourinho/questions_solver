from flask_mail import Mail, Message
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

class MailService:
    def __init__(self, mail):
      self.mail = mail
      self.admin_email = "iloveprovaantiga@gmail.com"

    def notify_admin_payment_confirmation(self, userEmail):
      if os.getenv("ENV") == 'production':
        subject = "Confirmação de Pagamento"
        body = f"O seguinte usuário efetuou o pagamento:\n{userEmail}"
      else:
        subject = "[TESTE] Confirmação de Pagamento"
        body = "O seguinte usuário não pagou, porém terá sua prova resolvida por estar no ambiente de teste:"
      try:
          msg = Message(subject, recipients=[self.admin_email])
          msg.body = body

          self.mail.send(msg)
          return f"Email successfully sent to admin!"
      except Exception as e:
          return f"Failed to send email. Error: {str(e)}"

    def notify_user_payment_confirmation(self, userEmail):
      userEmail_basename = userEmail.split("@")[0]
      subject = "Pagamento confirmado! - iLoveProvaAntiga"
      body = f"Olá {userEmail_basename},\n\nSeu pagamento foi confirmado com sucesso!\n\nEstamos resolvendo a sua prova, que será enviada para o seu e-mail em poucos instantes.\n\nObrigado pela confiança!"

      try:
          msg = Message(subject, recipients=[userEmail])
          msg.body = body

          self.mail.send(msg)
          return f"Email successfully sent to user!"
      except Exception as e:
          return f"Failed to send email. Error: {str(e)}"

    def notify_admin_and_user_payment_confirmation(self, userEmail):
      self.notify_admin_payment_confirmation(userEmail)
      if (os.getenv("ENV") == 'production'):
        self.notify_user_payment_confirmation(userEmail)


    def send_admin_output_file(self, userEmail, pdf_filename):
      subject = "Prova Resolvida! - iLoveProvaAntiga"

      try:
          msg_to_admin = Message(subject, recipients=[self.admin_email])
          body_to_admin = f"O seguinte usuário recebeu a prova resolvida em anexo:\n{userEmail}"
          msg_to_admin.body = body_to_admin

          # Attach the files using standard Python file handling
          file_basename, _ = os.path.splitext(pdf_filename)
          output1_file_path = os.path.join(current_dir, "..", "gpt_api", "output_2_pdfs", file_basename + "_resolvida.pdf")
          output2_file_path = os.path.join(current_dir, "..", "gpt_api", "output_2_pdfs", file_basename + "_resolvida.docx")

          with open(output1_file_path, 'rb') as fp:
              msg_to_admin.attach("prova_resolvida.pdf", "application/pdf", fp.read())

          with open(output2_file_path, 'rb') as fp:
              msg_to_admin.attach("prova_resolvida.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", fp.read())

          self.mail.send(msg_to_admin)

          return f"Emails with attachment successfully sent to admin!"
      except Exception as e:
          return f"Failed to send email with attachment. Error: {str(e)}"

    def send_user_output_file(self, userEmail, pdf_filename):
      subject = "Prova Resolvida! - iLoveProvaAntiga"
      userEmail_basename = userEmail.split("@")[0]

      try:
          msg_to_user = Message(subject, recipients=[userEmail])
          body_to_user = f"Olá {userEmail_basename}!\n\nSua prova foi resolvida com sucesso e já está pronta. Confira o arquivo em anexo!\n\nObrigado por confiar em nosso serviço!"
          msg_to_user.body = body_to_user

          # Attach the files using standard Python file handling
          file_basename, _ = os.path.splitext(pdf_filename)
          output1_file_path = os.path.join(current_dir, "..", "gpt_api", "output_2_pdfs", file_basename + "_resolvida.pdf")
          output2_file_path = os.path.join(current_dir, "..", "gpt_api", "output_2_pdfs", file_basename + "_resolvida.docx")

          with open(output1_file_path, 'rb') as fp:
              msg_to_user.attach("prova_resolvida.pdf", "application/pdf", fp.read())

          with open(output2_file_path, 'rb') as fp:
              msg_to_user.attach("prova_resolvida.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", fp.read())

          self.mail.send(msg_to_user)

          return f"Emails with attachment successfully sent to user!"
      except Exception as e:
          return f"Failed to send email with attachment. Error: {str(e)}"
          
    def send_admin_and_user_output_file(self, userEmail, pdf_filename):
      self.send_admin_output_file(userEmail, pdf_filename)
      self.send_user_output_file(userEmail, pdf_filename)
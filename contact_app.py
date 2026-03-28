from flask import Flask, render_template, request, flash, redirect, url_for
from flask_wtf.csrf import CSRFProtect
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, validators
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
csrf = CSRFProtect(app)

class ContactForm(FlaskForm):
    name = StringField('Name', [
        validators.Length(min=2, max=50, message='Name must be between 2 and 50 characters'),
        validators.DataRequired(message='Name is required')
    ])
    email = StringField('Email', [
        validators.Email(message='Please enter a valid email address'),
        validators.DataRequired(message='Email is required')
    ])
    message = TextAreaField('Message', [
        validators.Length(min=10, max=500, message='Message must be between 10 and 500 characters'),
        validators.DataRequired(message='Message is required')
    ])

def send_email(name, email, message):
    try:
        # Email configuration - update with your SMTP details
        smtp_server = "smtp.gmail.com"  # Change to your SMTP server
        smtp_port = 587
        sender_email = "your-email@gmail.com"  # Change to your email
        sender_password = "your-app-password"  # Change to your app password
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = sender_email  # Sending to yourself
        msg['Subject'] = f"New Contact Form Submission from {name}"
        
        # Email body
        body = f"""
        You have received a new message from your website contact form.
        
        Name: {name}
        Email: {email}
        Message: {message}
        
        Sent on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, sender_email, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/')
def contact():
    form = ContactForm()
    return render_template('contact.html', form=form)

@app.route('/submit', methods=['POST'])
def submit_contact():
    form = ContactForm(request.form)
    
    if form.validate():
        name = form.name.data
        email = form.email.data
        message = form.message.data
        
        # Send email
        if send_email(name, email, message):
            flash('Thank you for your message! We will get back to you soon.', 'success')
        else:
            flash('Sorry, there was an error sending your message. Please try again later.', 'error')
        
        return redirect(url_for('contact'))
    else:
        # Flash validation errors
        for field, errors in form.errors.items():
            for error in errors:
                flash(f'{field.capitalize()}: {error}', 'error')
        
        return redirect(url_for('contact'))

if __name__ == '__main__':
    app.run(debug=True)
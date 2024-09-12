from flask import Flask, redirect, request, session, url_for, render_template
import requests
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_flask_secret_key'  # Change this to a random key

# Discord Bot Setup
DISCORD_CLIENT_ID = '1264130193870684162'
DISCORD_CLIENT_SECRET = 'K93qrFC5f0-hj0BVmxaqSSnMyj-TQCB-'
DISCORD_REDIRECT_URI = 'https://yourwebsite.com/auth/callback'
DISCORD_API_URL = 'https://discord.com/api/v10'

# SQLite Setup
def create_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (discord_id TEXT PRIMARY KEY, discord_name TEXT, xbox_name TEXT)''')
    conn.commit()
    conn.close()

def insert_user(discord_id, discord_name, xbox_name):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('INSERT OR REPLACE INTO users (discord_id, discord_name, xbox_name) VALUES (?, ?, ?)',
              (discord_id, discord_name, xbox_name))
    conn.commit()
    conn.close()

# Flask Routes
@app.route('/')
def home():
    if 'discord_id' in session:
        discord_id = session['discord_id']
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute('SELECT discord_name, xbox_name FROM users WHERE discord_id=?', (discord_id,))
        user = c.fetchone()
        conn.close()
        if user:
            discord_name, xbox_name = user
            return render_template('index.html', discord_name=discord_name, xbox_name=xbox_name)
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return redirect(f'https://discord.com/oauth2/authorize?client_id={DISCORD_CLIENT_ID}&redirect_uri={DISCORD_REDIRECT_URI}&response_type=code&scope=identify+connections')

@app.route('/auth/callback')
def auth_callback():
    code = request.args.get('code')
    if code:
        token = exchange_code_for_token(code)
        user_info = get_discord_user_info(token)
        xbox_info = get_xbox_info(token)
        insert_user(user_info['id'], user_info['username'], xbox_info.get('gamertag', 'N/A'))
        session['discord_id'] = user_info['id']
        return redirect(url_for('home'))
    return 'Error: No code provided.'

@app.route('/logout')
def logout():
    session.pop('discord_id', None)
    return redirect(url_for('home'))

def exchange_code_for_token(code):
    response = requests.post(
        'https://discord.com/api/oauth2/token',
        data={
            'client_id': DISCORD_CLIENT_ID,
            'client_secret': DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': DISCORD_REDIRECT_URI,
            'scope': 'identify connections'
        },
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    response_data = response.json()
    return response_data['access_token']

def get_discord_user_info(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{DISCORD_API_URL}/users/@me', headers=headers)
    return response.json()

def get_xbox_info(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'https://xbl.io/api/v2/account', headers=headers)  # Adjust URL if needed
    return response.json()

# Run Flask app
if __name__ == '__main__':
    create_db()
    app.run(debug=True, port=5000)
